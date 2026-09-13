const { GoogleGenAI } = require('@google/genai');
const mealService = require('../services/mealService');
const prisma = require('../config/db');
const crypto = require('crypto');
const fs = require('fs');
const { getFoodAnalysisQueue } = require('../queues/foodAnalysis.queue');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `You are CalorieMate AI, a friendly and knowledgeable nutrition assistant built into a calorie tracking app.

Your capabilities:
1. **Log meals**: When a user says they ate something, IMMEDIATELY call logMeal with your best nutritional estimate. Do NOT ask for confirmation.
2. **Check meals**: Use getMeals to look up what the user has logged.
3. **Check goals**: Use getGoals to retrieve the user's calorie/macro targets.
4. **Weekly summaries**: Use getMeals for multiple dates to give a weekly overview.
5. **Nutrition questions**: Answer any nutrition, diet, or health-related question.

IMPORTANT RULES:
- For any food mentioned, call logMeal IMMEDIATELY using your nutritional knowledge. Don't ask "should I log it?" — just do it.
- If a food is very common (apple, banana, rice, chicken breast, milk, eggs etc.) use standard serving sizes and well-known nutritional values.
- Keep responses short, warm, and conversational. Use markdown formatting (bold, bullet points).
- After logging a meal, confirm what you logged with the calories.
- Today's date context: The user is tracking calories. Be helpful and proactive.`;

const tools = [
  {
    type: 'function',
    name: 'logMeal',
    description: 'Logs a meal or food item with nutritional info to the database. Call this immediately when user mentions eating anything.',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Descriptive name of the food/meal (e.g., "2 Bananas + 500ml Whole Milk")' },
        mealType: { type: 'string', enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'], description: 'Meal type based on context or time of day' },
        calories: { type: 'number', description: 'Total calories (kcal)' },
        protein: { type: 'number', description: 'Total protein in grams' },
        carbs: { type: 'number', description: 'Total carbohydrates in grams' },
        fat: { type: 'number', description: 'Total fat in grams' },
        date: { type: 'string', description: 'Date in YYYY-MM-DD format. Omit for today.' }
      },
      required: ['name', 'mealType', 'calories', 'protein', 'carbs', 'fat']
    }
  },
  {
    type: 'function',
    name: 'getMeals',
    description: "Gets the user's logged meals and nutritional totals for a specific date.",
    parameters: {
      type: 'object',
      properties: {
        date: { type: 'string', description: 'Date in YYYY-MM-DD format. Omit for today.' }
      }
    }
  },
  {
    type: 'function',
    name: 'getGoals',
    description: "Gets the user's daily nutritional goals (calorie limit, protein, carbs, fat targets).",
    parameters: {
      type: 'object',
      properties: {
        date: { type: 'string', description: 'Optional date in YYYY-MM-DD format to get date-specific goal.' }
      }
    }
  },
  {
    type: 'function',
    name: 'getWeeklySummary',
    description: "Gets a summary of meals logged over the past 7 days.",
    parameters: {
      type: 'object',
      properties: {}
    }
  }
];

// Execute a single tool call and return the result string
async function executeTool(name, args, userId) {
  try {
    if (name === 'logMeal') {
      let mealDate = new Date();
      if (args.date) {
        mealDate = new Date(args.date);
      }
      // Ensure we normalize the date to start of day to avoid timezone drift
      mealDate.setHours(12, 0, 0, 0);

      const mealData = {
        name: args.name,
        mealType: args.mealType,
        calories: Math.round(args.calories),
        protein: Math.round(args.protein * 10) / 10,
        carbs: Math.round(args.carbs * 10) / 10,
        fat: Math.round(args.fat * 10) / 10,
        date: mealDate,
      };
      const createdMeal = await mealService.addMeal(userId, mealData);
      return {
        success: true,
        action: 'MEAL_LOGGED',
        message: `Meal "${args.name}" logged successfully.`,
        data: { id: createdMeal.id, ...mealData }
      };
    }

    if (name === 'getMeals') {
      const targetDate = args.date ? new Date(args.date) : new Date();
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const meals = await prisma.meal.findMany({
        where: { userId, date: { gte: startOfDay, lte: endOfDay } },
        orderBy: { date: 'asc' }
      });

      const totals = meals.reduce((acc, m) => ({
        calories: acc.calories + m.calories,
        protein: acc.protein + m.protein,
        carbs: acc.carbs + m.carbs,
        fat: acc.fat + m.fat
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

      return {
        success: true,
        date: targetDate.toISOString().split('T')[0],
        mealsCount: meals.length,
        meals: meals.map(m => ({
          name: m.name,
          mealType: m.mealType,
          calories: m.calories,
          protein: m.protein,
          carbs: m.carbs,
          fat: m.fat
        })),
        totals: {
          calories: Math.round(totals.calories),
          protein: Math.round(totals.protein * 10) / 10,
          carbs: Math.round(totals.carbs * 10) / 10,
          fat: Math.round(totals.fat * 10) / 10,
        }
      };
    }

    if (name === 'getGoals') {
      let goal = null;
      if (args.date) {
        goal = await prisma.goal.findFirst({ where: { userId, date: args.date } });
      }
      if (!goal) {
        goal = await prisma.goal.findFirst({ where: { userId, date: null }, orderBy: { id: 'desc' } });
      }
      if (!goal) {
        goal = await prisma.goal.findFirst({ where: { userId }, orderBy: { id: 'desc' } });
      }
      return {
        success: true,
        data: goal || { message: 'No goals set yet. You can set daily goals from the app.' }
      };
    }

    if (name === 'getWeeklySummary') {
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 6);
      sevenDaysAgo.setHours(0, 0, 0, 0);
      today.setHours(23, 59, 59, 999);

      const meals = await prisma.meal.findMany({
        where: { userId, date: { gte: sevenDaysAgo, lte: today } },
        orderBy: { date: 'asc' }
      });

      // Group by date
      const byDate = {};
      meals.forEach(m => {
        const dateKey = m.date.toISOString().split('T')[0];
        if (!byDate[dateKey]) byDate[dateKey] = { calories: 0, protein: 0, carbs: 0, fat: 0, mealCount: 0 };
        byDate[dateKey].calories += m.calories;
        byDate[dateKey].protein += m.protein;
        byDate[dateKey].carbs += m.carbs;
        byDate[dateKey].fat += m.fat;
        byDate[dateKey].mealCount++;
      });

      const days = Object.entries(byDate).map(([date, data]) => ({ date, ...data }));
      const avgCalories = days.length > 0 ? Math.round(days.reduce((a, d) => a + d.calories, 0) / days.length) : 0;

      return {
        success: true,
        daysTracked: days.length,
        avgDailyCalories: avgCalories,
        dailyBreakdown: days
      };
    }

    return { success: false, error: `Unknown tool: ${name}` };
  } catch (err) {
    console.error(`Tool ${name} error:`, err);
    return { success: false, error: err.message };
  }
}

exports.chat = async (req, res) => {
  // Set SSE headers immediately
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); // Flush headers to establish the SSE connection before any async work

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const { message, history } = req.body;
    const userId = req.user.id;

    // Build input array
    const input = [{ type: 'text', text: SYSTEM_INSTRUCTION }];

    // Add conversation history (last 10 messages only to keep context manageable)
    const recentHistory = (history || []).slice(-10);
    recentHistory.forEach(msg => {
      input.push({ type: 'text', text: `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}` });
    });

    // Add current message
    input.push({ type: 'text', text: `User: ${message}` });

    let actionsPerformed = []; // Track all actions taken in this turn

    // -----------------------------------------------
    // AGENTIC LOOP: Keep running until no more tools
    // -----------------------------------------------
    let currentInput = input;
    let previousInteractionId = null;
    let loopCount = 0;
    const MAX_LOOPS = 5; // Safety limit

    while (loopCount < MAX_LOOPS) {
      loopCount++;

      // Collect all tool calls from this iteration's stream
      const collectedToolCalls = [];
      let currentToolCall = null;

      const streamParams = {
        model: 'gemini-3.8-flash',
        input: currentInput,
        tools: tools,
        stream: true
      };

      if (previousInteractionId) {
        streamParams.previous_interaction_id = previousInteractionId;
      }

      const stream = await ai.interactions.create(streamParams);

      for await (const chunk of stream) {
        switch (chunk.event_type) {
          case 'interaction.created':
            if (chunk.interaction?.id) {
              previousInteractionId = chunk.interaction.id;
            }
            break;

          case 'step.start':
            if (chunk.step?.type === 'function_call') {
              currentToolCall = {
                id: chunk.step.id || `call_${Date.now()}`,
                name: chunk.step.name,
                argumentsStr: ''
              };
            }
            break;

          case 'step.delta':
            if (chunk.delta?.type === 'text' && chunk.delta.text) {
              // Stream text tokens to the client in real-time
              sendEvent({ type: 'text_delta', text: chunk.delta.text });
            } else if (chunk.delta?.type === 'arguments_delta' && currentToolCall) {
              currentToolCall.argumentsStr += (chunk.delta.arguments || '');
            }
            break;

          case 'step.stop':
            // Only finalize if we were building a tool call
            if (currentToolCall) {
              try {
                currentToolCall.arguments = JSON.parse(currentToolCall.argumentsStr || '{}');
              } catch (e) {
                currentToolCall.arguments = {};
              }
              collectedToolCalls.push({ ...currentToolCall });
              currentToolCall = null;
            }
            break;

          case 'error':
            console.error('Gemini stream error event:', chunk.error);
            sendEvent({ type: 'error', text: chunk.error?.message || 'AI encountered an error.' });
            res.write('data: [DONE]\n\n');
            res.end();
            return;
        }
      }

      // If no tool calls this iteration, we're done — AI finished responding
      if (collectedToolCalls.length === 0) {
        break;
      }

      // Execute all tool calls and collect results
      const toolResultInputs = [];
      for (const tc of collectedToolCalls) {
        console.log(`[AI] Executing tool: ${tc.name}`, tc.arguments);
        const result = await executeTool(tc.name, tc.arguments, userId);
        console.log(`[AI] Tool result for ${tc.name}:`, result);

        // Track actions for UI refresh signals
        if (result.action) {
          actionsPerformed.push(result.action);
        }

        toolResultInputs.push({
          type: 'function_result',
          name: tc.name,
          call_id: tc.id,
          result: JSON.stringify(result)
        });
      }

      // Send the tool results back as the next iteration's input
      currentInput = toolResultInputs;
    }

    // Signal any UI refreshes needed
    if (actionsPerformed.length > 0) {
      sendEvent({ type: 'actions', actions: actionsPerformed });
    }

    // Signal stream completion
    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error('AI Chat Error:', error);
    sendEvent({ type: 'error', text: error.message || 'Sorry, something went wrong. Please try again.' });
    res.write('data: [DONE]\n\n');
    res.end();
  }
};

// ---------------------------------------------------------------------------
// POST /api/ai/analyze-food
// Accepts an uploaded food image, enqueues a BullMQ job, returns a job ID.
// The heavy AI call runs in the background worker — not in this HTTP request.
// ---------------------------------------------------------------------------
exports.analyzeFood = asyncHandler(async (req, res, next) => {
    if (!req.file) {
      return next(new AppError('No image file uploaded.', 400));
    }

    const userId = req.user.id; // always from JWT
    const imagePath = req.file.path; // e.g. uploads/image-1234567890.jpg

    // Compute SHA-256 of the file for idempotency
    const fileBuffer = fs.readFileSync(imagePath);
    const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Check if the same user has already submitted (or is processing) this exact file
    const existing = await prisma.foodAnalysisJob.findUnique({
      where: { userId_fileHash: { userId, fileHash } },
    });

    if (existing) {
      // If already COMPLETED, return the cached result immediately
      if (existing.status === 'COMPLETED') {
        return res.status(200).json({
          success: true,
          jobId: existing.imageId,
          status: 'COMPLETED',
          result: existing.result,
          message: 'Result from previous identical upload.',
        });
      }
      // If still running, return existing job ID so frontend can poll
      return res.status(200).json({
        success: true,
        jobId: existing.imageId,
        status: existing.status,
        message: 'A job for this image is already in progress.',
      });
    }

    // --- Enqueue BullMQ job ---
    const queue = getFoodAnalysisQueue();

    if (!queue) {
      // Redis is down — fail gracefully with a clear error
      return next(new AppError('Food analysis service is temporarily unavailable. Please try again shortly.', 503));
    }

    const jobId = crypto.randomUUID();
    const job = await queue.add('analyze', {
      userId,
      imagePath,
      fileHash,
    }, { jobId });

    // Persist job record in DB (status = PENDING)
    await prisma.foodAnalysisJob.create({
      data: {
        imageId: job.id,          // BullMQ job ID
        imagePath,
        fileHash,
        status: 'PENDING',
        userId,
      },
    });

    console.log(`[AI] Queued food-analysis job ${job.id} for user ${userId}`);

    return res.status(202).json({
      success: true,
      jobId: job.id,
      status: 'PENDING',
      message: 'Image received. AI analysis is running in the background.',
    });
});

// ---------------------------------------------------------------------------
// GET /api/ai/analyze-food/:jobId/status
// Returns the status (and result if completed) for a food-analysis job.
// Security: the job MUST belong to the authenticated user.
// ---------------------------------------------------------------------------
exports.getAnalysisStatus = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const { jobId } = req.params;

    const job = await prisma.foodAnalysisJob.findUnique({
      where: { imageId: jobId },
    });

    // Not found, or belongs to a different user — return 404 in both cases
    // (never reveal that the job exists for another user)
    if (!job || job.userId !== userId) {
      return next(new AppError('Job not found.', 404));
    }

    const response = {
      success: true,
      jobId: job.imageId,
      status: job.status,
    };

    if (job.status === 'COMPLETED') {
      response.result = job.result;
    }
    if (job.status === 'FAILED') {
      response.error = job.errorMsg || 'Analysis failed. Please try again.';
    }

    return res.status(200).json(response);
});
