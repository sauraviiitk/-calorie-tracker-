// pdfImport.worker.js — BullMQ worker for async PDF diary import
// Run: node src/workers/pdfImport.worker.js
//
// Picks up jobs from the 'pdf-import' queue.
// Calls the EXISTING AI parse logic from pdfImportController (extracted as a service).
// Validates + bulk-inserts meals. Updates PdfImportJob status in DB.

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const { Worker } = require('bullmq');
const { getBullMQConnection } = require('../config/redis');
const prisma = require('../config/db');
const { QUEUE_NAME } = require('../queues/pdfImport.queue');
const { GoogleGenAI } = require('@google/genai');
const mealService = require('../services/mealService');
const fs = require('fs');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ---- Startup ----
console.log('[Worker:PDF] pdf-import worker starting...');

const connection = getBullMQConnection();
if (!connection) {
  console.error('[Worker:PDF] Redis is unavailable. Worker cannot start.');
  throw new Error('[Worker:PDF] Redis is unavailable. Worker cannot start.');
}

// ---- Core AI PDF parse logic (extracted from pdfImportController, unchanged) ----
async function parsePdfWithAI(pdfPath) {
  const pdfBase64 = fs.readFileSync(pdfPath).toString('base64');

  const prompt = `You are a nutrition data parser. I have attached a food diary or nutrition history PDF.

Your task: Extract every meal/food entry from this document and return a valid JSON array.

Each entry must have these exact fields:
- name: string (food/meal name)
- mealType: string (must be exactly one of: "Breakfast", "Lunch", "Dinner", "Snacks")
- calories: number (kcal, integer)
- protein: number (grams, 1 decimal place)
- carbs: number (grams, 1 decimal place)  
- fat: number (grams, 1 decimal place)
- date: string (YYYY-MM-DD format — infer from context, use today if unknown: ${new Date().toISOString().split('T')[0]})

Rules:
- Read the tables or text carefully.
- If a field is missing in the source, estimate it based on the food name and standard nutritional data.
- If mealType is unclear from context, infer from meal name or time context (morning→Breakfast, midday→Lunch, evening→Dinner, snack→Snacks).
- Return ONLY a valid JSON array, no markdown, no explanation, no code blocks. Just the raw JSON array.
- If no valid food entries are found, return an empty array: []`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: [
      {
        role: 'user',
        parts: [
          { inlineData: { data: pdfBase64, mimeType: 'application/pdf' } },
          { text: prompt },
        ],
      },
    ],
  });

  let rawResponse = (response.text || '').trim();
  if (rawResponse.startsWith('```')) {
    rawResponse = rawResponse.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '').trim();
  }

  const parsed = JSON.parse(rawResponse);
  return Array.isArray(parsed) ? parsed : [];
}

// ---- Job Processor ----
async function processJob(job) {
  const { userId, pdfPath, fileHash } = job.data;

  console.log(`[Worker:PDF] Processing job ${job.id} for user ${userId} | attempt ${job.attemptsMade + 1}`);

  // Mark as PROCESSING
  await prisma.pdfImportJob.updateMany({
    where: { imageId: job.id },
    data: { status: 'PROCESSING' },
  });

  // Step 1: AI parse
  const parsedEntries = await parsePdfWithAI(pdfPath);

  if (parsedEntries.length === 0) {
    // Not a failure — just no entries found; mark COMPLETED with empty result
    await prisma.pdfImportJob.updateMany({
      where: { imageId: job.id },
      data: {
        status: 'COMPLETED',
        result: { imported: 0, skipped: 0, message: 'No food entries could be found in the PDF.', entries: [] },
      },
    });
    console.log(`[Worker:PDF] Job ${job.id} completed — no entries found`);
    return;
  }

  // Step 2: Validate + bulk insert (same logic as pdfImportController)
  const VALID_MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
  const today = new Date().toISOString().split('T')[0];

  let imported = 0;
  let skipped = 0;
  const importedEntries = [];

  for (const entry of parsedEntries) {
    try {
      if (!entry.name || typeof entry.calories !== 'number') { skipped++; continue; }

      const mealType = VALID_MEAL_TYPES.includes(entry.mealType) ? entry.mealType : 'Snacks';
      let mealDate = new Date(entry.date || today);
      if (isNaN(mealDate.getTime())) mealDate = new Date();
      mealDate.setHours(12, 0, 0, 0);

      const mealData = {
        name:     String(entry.name).slice(0, 200),
        mealType,
        calories: Math.round(Math.max(0, Number(entry.calories) || 0)),
        protein:  Math.round(Math.max(0, Number(entry.protein)  || 0) * 10) / 10,
        carbs:    Math.round(Math.max(0, Number(entry.carbs)    || 0) * 10) / 10,
        fat:      Math.round(Math.max(0, Number(entry.fat)      || 0) * 10) / 10,
        date:     mealDate,
      };

      const created = await mealService.addMeal(userId, mealData);
      importedEntries.push({ ...mealData, id: created.id, date: mealDate.toISOString().split('T')[0] });
      imported++;
    } catch {
      skipped++;
    }
  }

  const result = {
    imported,
    skipped,
    message: `Successfully imported ${imported} meal${imported !== 1 ? 's' : ''}${skipped > 0 ? `, skipped ${skipped}` : ''}.`,
    entries: importedEntries,
  };

  // Step 3: Persist result in a transaction
  await prisma.$transaction([
    prisma.pdfImportJob.updateMany({
      where: { imageId: job.id, userId },
      data: { status: 'COMPLETED', result, errorMsg: null },
    }),
  ]);

  console.log(`[Worker:PDF] Job ${job.id} COMPLETED — imported ${imported}, skipped ${skipped}`);
  return result;
}

// ---- Worker Instance ----
const worker = new Worker(QUEUE_NAME, processJob, {
  connection,
  concurrency: 1,           // PDFs are heavy — process one at a time
  limiter: {
    max: 3,
    duration: 10000,        // max 3 PDFs per 10s (Gemini rate limits)
  },
});

// ---- Event Handlers ----
worker.on('completed', (job, result) => {
  console.log(`[Worker:PDF] ✓ Job ${job.id} completed — imported ${result?.imported ?? 0}`);
});

worker.on('failed', async (job, err) => {
  console.error(`[Worker:PDF] ✗ Job ${job.id} failed (attempt ${job.attemptsMade}/${job.opts.attempts}):`, err.message);

  if (job.attemptsMade >= job.opts.attempts) {
    try {
      await prisma.pdfImportJob.updateMany({
        where: { imageId: job.id },
        data: {
          status: 'FAILED',
          errorMsg: err.message || 'Unknown error during PDF parsing',
        },
      });
      console.log(`[Worker:PDF] Marked job ${job.id} as FAILED in DB`);
    } catch (dbErr) {
      console.error('[Worker:PDF] Failed to update DB on job failure:', dbErr.message);
    }
  }
});

worker.on('error', (err) => {
  console.error('[Worker:PDF] Worker-level error:', err.message);
});

// ---- Graceful Shutdown ----
async function shutdown() {
  console.log('[Worker:PDF] Shutting down gracefully...');
  await worker.close();
  await prisma.$disconnect();
  process.exit(0);
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

console.log(`[Worker:PDF] Listening for jobs on queue: ${QUEUE_NAME}`);
