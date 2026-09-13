// foodAnalysis.worker.js — BullMQ worker for async AI food image analysis
// Run this as a separate process: node src/workers/foodAnalysis.worker.js
//
// This worker:
//   1. Picks up jobs from the 'food-analysis' BullMQ queue
//   2. Calls the existing geminiVisionService.analyzeImage() (zero changes to AI logic)
//   3. Validates the response
//   4. Updates the FoodAnalysisJob record in PostgreSQL inside a transaction
//   5. Handles retries automatically via BullMQ (3 attempts, exponential backoff)

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const { Worker } = require('bullmq');
const { getBullMQConnection } = require('../config/redis');
const geminiVisionService = require('../services/geminiVisionService');
const prisma = require('../config/db');
const { QUEUE_NAME } = require('../queues/foodAnalysis.queue');
const { formatAiError } = require('../utils/aiErrorHandler');

// ---- Startup ----
console.log('[Worker] food-analysis worker starting...');

const connection = getBullMQConnection();
if (!connection) {
  console.error('[Worker] Redis is unavailable. Worker cannot start.');
  throw new Error('[Worker] Redis is unavailable. Worker cannot start.');
}

// ---- Job Processor ----
async function processJob(job) {
  const { userId, imagePath, fileHash } = job.data;

  console.log(`[Worker] Processing job ${job.id} for user ${userId} | attempt ${job.attemptsMade + 1}`);

  // Mark job as PROCESSING in DB
  await prisma.foodAnalysisJob.updateMany({
    where: { imageId: job.id },
    data: { status: 'PROCESSING' },
  });

  // Call the existing AI vision service — NO changes to this function
  const nutritionData = await geminiVisionService.analyzeImage(imagePath);

  // Validate the response shape before persisting
  if (
    !nutritionData ||
    typeof nutritionData.calories !== 'number' ||
    !nutritionData.name
  ) {
    throw new Error('Invalid AI response — missing required nutritional fields');
  }

  // Round values for consistency
  const result = {
    name:     String(nutritionData.name),
    calories: Math.round(nutritionData.calories),
    protein:  Math.round((nutritionData.protein  || 0) * 10) / 10,
    carbs:    Math.round((nutritionData.carbs     || 0) * 10) / 10,
    fat:      Math.round((nutritionData.fat       || 0) * 10) / 10,
  };

  // Persist the result in a transaction — atomically update status + result
  await prisma.$transaction([
    prisma.foodAnalysisJob.updateMany({
      where: { imageId: job.id, userId }, // userId check = extra safety
      data: {
        status: 'COMPLETED',
        result,
        errorMsg: null,
      },
    }),
  ]);

  console.log(`[Worker] Job ${job.id} COMPLETED — ${result.name} (${result.calories} kcal)`);
  return result;
}

// ---- Worker Instance ----
const worker = new Worker(QUEUE_NAME, processJob, {
  connection,
  concurrency: 2,           // process up to 2 images in parallel
  limiter: {
    max: 5,                 // max 5 jobs per 10 seconds (respect Gemini rate limits)
    duration: 10000,
  },
});

// ---- Event Handlers ----
worker.on('completed', (job, result) => {
  console.log(`[Worker] ✓ Job ${job.id} completed:`, result?.name);
});

worker.on('failed', async (job, err) => {
  console.error(`[Worker] ✗ Job ${job.id} failed (attempt ${job.attemptsMade}/${job.opts.attempts}):`, err.message);

  // On final failure (no more retries left), mark the DB record as FAILED
  if (job.attemptsMade >= job.opts.attempts) {
    try {
      await prisma.foodAnalysisJob.updateMany({
        where: { imageId: job.id },
        data: {
          status: 'FAILED',
          errorMsg: formatAiError(err) || 'Unknown error during AI analysis',
        },
      });
      console.log(`[Worker] Marked job ${job.id} as FAILED in DB`);
    } catch (dbErr) {
      console.error('[Worker] Failed to update DB on job failure:', dbErr.message);
    }
  }
});

worker.on('error', (err) => {
  console.error('[Worker] Worker-level error:', err.message);
});

// ---- Graceful Shutdown ----
async function shutdown() {
  console.log('[Worker] Shutting down gracefully...');
  await worker.close();
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

console.log(`[Worker] Listening for jobs on queue: ${QUEUE_NAME}`);
