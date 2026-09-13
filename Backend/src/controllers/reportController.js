// reportController.js
const prisma = require('../config/db');
const { cacheGet, cacheSet, weeklyReportKey, REPORT_CACHE_TTL } = require('../utils/cacheUtils');
const asyncHandler = require('../utils/asyncHandler');

/**
 * GET /api/reports/weekly
 * Returns a weekly nutrition report for the last 7 days.
 * Cached in Redis by userId + date range, TTL 1 hour.
 * Falls back to PostgreSQL if Redis is unavailable.
 */
exports.getWeeklyReport = asyncHandler(async (req, res, next) => {
    const userId = req.user.id; // always from JWT — never from request body

    // Compute the date range for the last 7 days
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const startStr = start.toISOString().split('T')[0];
    const endStr   = end.toISOString().split('T')[0];

    // --- STEP 1: Try Redis cache ---
    const cacheKey = weeklyReportKey(userId, startStr, endStr);
    const cached = await cacheGet(cacheKey);

    if (cached) {
      console.log(`[Cache] HIT  weekly_report for user ${userId} (${startStr}→${endStr})`);
      return res.status(200).json({ success: true, cached: true, data: cached });
    }

    console.log(`[Cache] MISS weekly_report for user ${userId} (${startStr}→${endStr}) — querying DB`);

    // --- STEP 2: Query PostgreSQL ---
    const [meals, goals] = await Promise.all([
      prisma.meal.findMany({
        where: {
          userId,
          date: { gte: start, lte: end },
        },
        orderBy: { date: 'asc' },
      }),
      prisma.goal.findMany({
        where: {
          userId,
          OR: [{ date: null }, { date: { gte: startStr, lte: endStr } }],
        },
      }),
    ]);

    // --- STEP 3: Build the report ---
    const defaultGoal = goals.find(g => g.date === null) || goals[0] || null;

    // Helper to get local date string (YYYY-MM-DD)
    const toLocalDateStr = (d) => {
      const date = new Date(d);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };

    // Group meals by day
    const byDate = {};
    let cursor = new Date(start);
    while (cursor <= end) {
      const key = toLocalDateStr(cursor);
      const specificGoal = goals.find(g => g.date === key);
      byDate[key] = {
        date: key,
        calories: 0, protein: 0, carbs: 0, fat: 0,
        targetCalories: (specificGoal || defaultGoal)?.targetCalories || 2000,
        targetProtein:  (specificGoal || defaultGoal)?.targetProtein  || 150,
        targetCarbs:    (specificGoal || defaultGoal)?.targetCarbs    || 200,
        targetFat:      (specificGoal || defaultGoal)?.targetFat      || 65,
      };
      cursor.setDate(cursor.getDate() + 1);
    }

    meals.forEach(meal => {
      const key = toLocalDateStr(meal.date);
      if (byDate[key]) {
        byDate[key].calories += meal.calories || 0;
        byDate[key].protein  += meal.protein  || 0;
        byDate[key].carbs    += meal.carbs    || 0;
        byDate[key].fat      += meal.fat      || 0;
      }
    });

    const dailyBreakdown = Object.values(byDate);
    const daysWithData = dailyBreakdown.filter(d => d.calories > 0);
    const daysTracked = daysWithData.length;

    const totals = daysWithData.reduce(
      (acc, d) => ({
        calories: acc.calories + d.calories,
        protein:  acc.protein  + d.protein,
        carbs:    acc.carbs    + d.carbs,
        fat:      acc.fat      + d.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    const report = {
      startDate: startStr,
      endDate: endStr,
      daysTracked,
      avgDailyCalories:  daysTracked > 0 ? Math.round(totals.calories / daysTracked) : 0,
      avgDailyProtein:   daysTracked > 0 ? Math.round((totals.protein  / daysTracked) * 10) / 10 : 0,
      avgDailyCarbs:     daysTracked > 0 ? Math.round((totals.carbs    / daysTracked) * 10) / 10 : 0,
      avgDailyFat:       daysTracked > 0 ? Math.round((totals.fat      / daysTracked) * 10) / 10 : 0,
      goals: defaultGoal,
      dailyBreakdown,
    };

    // --- STEP 4: Store in Redis cache (non-blocking, never throws) ---
    await cacheSet(cacheKey, report, REPORT_CACHE_TTL);

    return res.status(200).json({ success: true, cached: false, data: report });
});

// Keep the original stub for backwards compatibility
exports.getReports = asyncHandler(async (req, res, next) => {
  const { page, limit, startDate, endDate } = req.query;
  res.status(200).json({ message: 'getReports placeholder', pagination: { page, limit } });
});
