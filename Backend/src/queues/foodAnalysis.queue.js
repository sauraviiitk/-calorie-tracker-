// foodAnalysis.queue.js — BullMQ queue for async AI food image analysis

const { Queue } = require('bullmq');
const { getBullMQConnection } = require('../config/redis');

const QUEUE_NAME = 'food-analysis';

let foodAnalysisQueue = null;

/**
 * Returns the BullMQ queue instance, or null if Redis is unavailable.
 * The queue is created lazily so startup doesn't fail when Redis is down.
 */
function getFoodAnalysisQueue() {
  if (foodAnalysisQueue) return foodAnalysisQueue;

  const connection = getBullMQConnection();
  if (!connection) {
    console.warn('[Queue] Redis unavailable — BullMQ queue not initialized');
    return null;
  }

  try {
    foodAnalysisQueue = new Queue(QUEUE_NAME, {
      connection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000, // 1st retry after 5s, 2nd after 25s
        },
        removeOnComplete: { count: 100 }, // keep last 100 completed jobs in Redis
        removeOnFail: { count: 50 },      // keep last 50 failed jobs for debugging
      },
    });

    foodAnalysisQueue.on('error', (err) => {
      console.error('[Queue] food-analysis queue error:', err.message);
    });

    console.log('[Queue] food-analysis queue initialized');
  } catch (err) {
    console.error('[Queue] Failed to initialize food-analysis queue:', err.message);
    return null;
  }

  return foodAnalysisQueue;
}

module.exports = { getFoodAnalysisQueue, QUEUE_NAME };
