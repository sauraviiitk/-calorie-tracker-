// cacheUtils.js — Shared caching helpers for report invalidation

const { getRedisClient } = require('../config/redis');

const REPORT_CACHE_TTL = 60 * 60; // 1 hour in seconds

/**
 * Build a Redis key for a weekly nutrition report.
 * Always scoped to userId so user A can never see user B's data.
 */
function weeklyReportKey(userId, startDate, endDate) {
  return `weekly_report:${userId}:${startDate}:${endDate}`;
}

/**
 * Invalidate ALL cached weekly reports for a specific user.
 * Called whenever meals or goals change for that user.
 * Uses SCAN so we never block Redis with KEYS.
 */
async function invalidateWeeklyReportCache(userId) {
  const redis = getRedisClient();
  if (!redis) return; // Redis unavailable — nothing to invalidate

  try {
    const pattern = `weekly_report:${userId}:*`;
    let cursor = '0';
    const keysToDelete = [];

    do {
      const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
      cursor = nextCursor;
      keysToDelete.push(...keys);
    } while (cursor !== '0');

    if (keysToDelete.length > 0) {
      await redis.del(...keysToDelete);
      console.log(`[Cache] Invalidated ${keysToDelete.length} weekly report cache key(s) for user ${userId}`);
    }
  } catch (err) {
    // Never let cache invalidation crash the main request
    console.warn('[Cache] Failed to invalidate weekly report cache:', err.message);
  }
}

/**
 * Try to get a value from Redis cache.
 * Returns parsed object on hit, null on miss or error.
 */
async function cacheGet(key) {
  const redis = getRedisClient();
  if (!redis) return null;

  try {
    const raw = await redis.get(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn('[Cache] GET error:', err.message);
    return null;
  }
}

/**
 * Store a value in Redis cache with a TTL.
 * Fails silently if Redis is unavailable.
 */
async function cacheSet(key, value, ttlSeconds = REPORT_CACHE_TTL) {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch (err) {
    console.warn('[Cache] SET error:', err.message);
  }
}

module.exports = { weeklyReportKey, invalidateWeeklyReportCache, cacheGet, cacheSet, REPORT_CACHE_TTL };
