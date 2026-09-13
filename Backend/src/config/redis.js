// redis.js — Redis connection factory
//
// BullMQ requires maxRetriesPerRequest: null (blocking commands).
// The cache client uses maxRetriesPerRequest: 1 (fail fast on HTTP requests).
// These must be SEPARATE connections.

const Redis = require('ioredis');

// ---- Parse Redis URL into connection options ----
function parseRedisUrl() {
  const url = process.env.REDIS_URL || 'redis://localhost:6379';
  // ioredis accepts the full URL string directly
  return url;
}

// ============================================================
// 1. CACHE CLIENT — used for GET/SET in HTTP request handlers
//    maxRetriesPerRequest: 1 → fail fast, never block a request
// ============================================================
let cacheClient = null;
let cacheConnectionFailed = false;

function getRedisClient() {
  if (cacheConnectionFailed) return null;
  if (cacheClient) return cacheClient;

  try {
    cacheClient = new Redis(parseRedisUrl(), {
      maxRetriesPerRequest: 1,
      enableReadyCheck: false,
      lazyConnect: true,
      connectTimeout: 3000,
    });

    cacheClient.on('connect', () => {
      console.log('[Redis] Cache client connected');
      cacheConnectionFailed = false;
    });

    cacheClient.on('error', (err) => {
      if (!cacheConnectionFailed) {
        console.warn('[Redis] Cache client error — caching disabled:', err.message);
      }
      cacheConnectionFailed = true;
      cacheClient = null;
    });

    cacheClient.on('close', () => {
      cacheConnectionFailed = true;
      cacheClient = null;
    });

    cacheClient.connect().catch(() => {
      cacheConnectionFailed = true;
      cacheClient = null;
    });

    return cacheClient;
  } catch (err) {
    console.warn('[Redis] Failed to create cache client:', err.message);
    cacheConnectionFailed = true;
    return null;
  }
}

// ============================================================
// 2. BULLMQ CONNECTION OPTIONS
//    BullMQ manages its own ioredis instances internally.
//    We pass a plain options object — maxRetriesPerRequest MUST be null.
//    Returns null if REDIS_URL is not set (app runs without BullMQ).
// ============================================================
function getBullMQConnection() {
  const url = process.env.REDIS_URL || 'redis://localhost:6379';

  try {
    // Parse the URL into host/port for BullMQ's connection options
    const parsed = new URL(url);
    return {
      host: parsed.hostname || 'localhost',
      port: parseInt(parsed.port, 10) || 6379,
      password: parsed.password || undefined,
      db: parsed.pathname ? parseInt(parsed.pathname.slice(1), 10) || 0 : 0,
      maxRetriesPerRequest: null,    // REQUIRED by BullMQ
      enableReadyCheck: false,
    };
  } catch (err) {
    console.warn('[Redis] Failed to parse REDIS_URL for BullMQ:', err.message);
    return null;
  }
}

module.exports = { getRedisClient, getBullMQConnection };
