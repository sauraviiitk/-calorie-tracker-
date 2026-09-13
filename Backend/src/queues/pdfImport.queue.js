// pdfImport.queue.js — BullMQ queue for async PDF diary import

const { Queue } = require('bullmq');
const { getBullMQConnection } = require('../config/redis');

const QUEUE_NAME = 'pdf-import';

let pdfImportQueue = null;

/**
 * Returns the BullMQ queue instance, or null if Redis is unavailable.
 */
function getPdfImportQueue() {
  if (pdfImportQueue) return pdfImportQueue;

  const connection = getBullMQConnection();
  if (!connection) {
    console.warn('[Queue] Redis unavailable — PDF import queue not initialized');
    return null;
  }

  try {
    pdfImportQueue = new Queue(QUEUE_NAME, {
      connection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000, // 1st retry after 5s, 2nd after 25s
        },
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 50 },
      },
    });

    pdfImportQueue.on('error', (err) => {
      console.error('[Queue] pdf-import queue error:', err.message);
    });

    console.log('[Queue] pdf-import queue initialized');
  } catch (err) {
    console.error('[Queue] Failed to initialize pdf-import queue:', err.message);
    return null;
  }

  return pdfImportQueue;
}

module.exports = { getPdfImportQueue, QUEUE_NAME };
