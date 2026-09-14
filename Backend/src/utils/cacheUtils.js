// cacheUtils.js — Shared caching helpers for Redis cache orchestration

const { getRedisClient } = require('../config/redis');

const REPORT_CACHE_TTL = 60 * 60; // 1 hour in seconds
const TODAY_CACHE_TTL = 30 * 60;   // 30 minutes in seconds

/**
 * Key for today's dashboard summary & daily meal totals
 */
function todaySummaryKey(userId, dateStr) {
  return `today_summary:${userId}:${dateStr}`;
}

/**
 * Key for weekly nutrition report (7-day intake vs targets)
 */
function weeklyReportKey(userId, startDate, endDate) {
  return `weekly_report:${userId}:${startDate}:${endDate}`;
}

/**
 * Key for analytical reports (multi-period, meal-type filtered)
 */
function analyticsReportKey(userId, startDate, endDate, mealType = 'All') {
  return `analytics_report:${userId}:${startDate}:${endDate}:${mealType || 'All'}`;
}

/**
 * Invalidate all cached data (today's summary, weekly report, analytics) for a user.
 * Called whenever meals or goals are added, updated, or deleted.
 * Uses SCAN so Redis is never blocked.
 */
async function invalidateUserCaches(userId) {
  const redis = getRedisClient();
  if (!redis) return; // Redis unavailable — caching is gracefully disabled

  try {
    const patterns = [
      `today_summary:${userId}:*`,
      `weekly_report:${userId}:*`,
      `analytics_report:${userId}:*`,
    ];

    let totalDeleted = 0;

    for (const pattern of patterns) {
      let cursor = '0';
      const keysToDelete = [];

      do {
        const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
        cursor = nextCursor;
        if (keys && keys.length > 0) {
          keysToDelete.push(...keys);
        }
      } while (cursor !== '0');

      if (keysToDelete.length > 0) {
        await redis.del(...keysToDelete);
        totalDeleted += keysToDelete.length;
      }
    }

    if (totalDeleted > 0) {
      console.log(`[Cache] Invalidated ${totalDeleted} cache key(s) for user ${userId}`);
    }
  } catch (err) {
    console.warn('[Cache] Failed to invalidate user caches:', err.message);
  }
}

// Backward-compatible alias
const invalidateWeeklyReportCache = invalidateUserCaches;

/**
 * Try to retrieve parsed JSON from Redis.
 */
async function cacheGet(key) {
  const redis = getRedisClient();
  if (!redis) return null;

  try {
    const raw = await redis.get(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`[Cache] GET error for key "${key}":`, err.message);
    return null;
  }
}

/**
 * Store JSON value in Redis with TTL.
 */
async function cacheSet(key, value, ttlSeconds = REPORT_CACHE_TTL) {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    console.log(`[Cache] SET key "${key}" (TTL: ${ttlSeconds}s)`);
  } catch (err) {
    console.warn(`[Cache] SET error for key "${key}":`, err.message);
  }
}

module.exports = {
  todaySummaryKey,
  weeklyReportKey,
  analyticsReportKey,
  invalidateUserCaches,
  invalidateWeeklyReportCache,
  cacheGet,
  cacheSet,
  REPORT_CACHE_TTL,
  TODAY_CACHE_TTL,
};
