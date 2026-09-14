// reportController.js — Nutrition summaries & analytics with multi-tier Redis caching
const prisma = require('../config/db');
const {
  cacheGet,
  cacheSet,
  todaySummaryKey,
  weeklyReportKey,
  analyticsReportKey,
  REPORT_CACHE_TTL,
  TODAY_CACHE_TTL,
} = require('../utils/cacheUtils');
const asyncHandler = require('../utils/asyncHandler');
const { getLocalDateString } = require('../utils/dateUtils');

/**
 * GET /api/reports/today
 * Returns today's logged meals, totals, and active goals with remaining budget.
 * Cached in Redis by todaySummaryKey (TTL 30 mins).
 */
exports.getTodaySummary = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const todayStr = req.query.date || getLocalDateString(new Date());

  const cacheKey = todaySummaryKey(userId, todayStr);
  const cached = await cacheGet(cacheKey);

  if (cached) {
    console.log(`[Cache] HIT  today_summary for user ${userId} (${todayStr})`);
    return res.status(200).json({ success: true, cached: true, data: cached });
  }

  console.log(`[Cache] MISS today_summary for user ${userId} (${todayStr}) — querying DB`);

  let startOfDay, endOfDay;
  if (req.query.startDate && req.query.endDate) {
    startOfDay = new Date(req.query.startDate);
    endOfDay = new Date(req.query.endDate);
  } else {
    const [year, month, day] = todayStr.split('-').map(Number);
    startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
    endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);
  }

  const [meals, dateGoal, defaultGoal] = await Promise.all([
    prisma.meal.findMany({
      where: {
        userId,
        date: { gte: startOfDay, lte: endOfDay },
      },
      orderBy: { date: 'asc' },
    }),
    prisma.goal.findFirst({
      where: { userId, date: todayStr },
    }),
    prisma.goal.findFirst({
      where: { userId, date: null },
      orderBy: { id: 'desc' },
    }),
  ]);

  const activeGoal = dateGoal || defaultGoal || null;

  const totals = meals.reduce(
    (acc, m) => ({
      calories: acc.calories + (m.calories || 0),
      protein: Math.round((acc.protein + (m.protein || 0)) * 10) / 10,
      carbs: Math.round((acc.carbs + (m.carbs || 0)) * 10) / 10,
      fat: Math.round((acc.fat + (m.fat || 0)) * 10) / 10,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const targetCalories = activeGoal?.targetCalories || 2000;
  const targetProtein = activeGoal?.targetProtein || 150;
  const targetCarbs = activeGoal?.targetCarbs || 200;
  const targetFat = activeGoal?.targetFat || 65;

  const summary = {
    date: todayStr,
    meals,
    count: meals.length,
    totals,
    goals: activeGoal,
    remaining: {
      calories: Math.max(0, targetCalories - totals.calories),
      protein: Math.max(0, Math.round((targetProtein - totals.protein) * 10) / 10),
      carbs: Math.max(0, Math.round((targetCarbs - totals.carbs) * 10) / 10),
      fat: Math.max(0, Math.round((targetFat - totals.fat) * 10) / 10),
    },
    percentages: {
      calories: Math.min(100, Math.round((totals.calories / targetCalories) * 100)),
      protein: Math.min(100, Math.round((totals.protein / targetProtein) * 100)),
      carbs: Math.min(100, Math.round((totals.carbs / targetCarbs) * 100)),
      fat: Math.min(100, Math.round((totals.fat / targetFat) * 100)),
    },
  };

  // Cache in Redis with 30-minute TTL
  await cacheSet(cacheKey, summary, TODAY_CACHE_TTL);

  return res.status(200).json({ success: true, cached: false, data: summary });
});

/**
 * GET /api/reports/weekly
 * Returns 7-day intake vs targets, daily breakdown, and weekly macro averages.
 * Cached in Redis by weeklyReportKey (TTL 1 hour).
 */
exports.getWeeklyReport = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const start = new Date();
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  const startStr = getLocalDateString(start);
  const endStr = getLocalDateString(end);

  const cacheKey = weeklyReportKey(userId, startStr, endStr);
  const cached = await cacheGet(cacheKey);

  if (cached) {
    console.log(`[Cache] HIT  weekly_report for user ${userId} (${startStr}→${endStr})`);
    return res.status(200).json({ success: true, cached: true, data: cached });
  }

  console.log(`[Cache] MISS weekly_report for user ${userId} (${startStr}→${endStr}) — querying DB`);

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

  const defaultGoal = goals.find((g) => g.date === null) || goals[0] || null;

  const byDate = {};
  let cursor = new Date(start);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  while (cursor <= end) {
    const key = getLocalDateString(cursor);
    const specificGoal = goals.find((g) => g.date === key);
    byDate[key] = {
      date: key,
      dayName: dayNames[cursor.getDay()],
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      targetCalories: (specificGoal || defaultGoal)?.targetCalories || 2000,
      targetProtein: (specificGoal || defaultGoal)?.targetProtein || 150,
      targetCarbs: (specificGoal || defaultGoal)?.targetCarbs || 200,
      targetFat: (specificGoal || defaultGoal)?.targetFat || 65,
    };
    cursor.setDate(cursor.getDate() + 1);
  }

  meals.forEach((meal) => {
    const key = getLocalDateString(meal.date);
    if (byDate[key]) {
      byDate[key].calories += meal.calories || 0;
      byDate[key].protein = Math.round((byDate[key].protein + (meal.protein || 0)) * 10) / 10;
      byDate[key].carbs = Math.round((byDate[key].carbs + (meal.carbs || 0)) * 10) / 10;
      byDate[key].fat = Math.round((byDate[key].fat + (meal.fat || 0)) * 10) / 10;
    }
  });

  const dailyBreakdown = Object.values(byDate);
  const daysWithData = dailyBreakdown.filter((d) => d.calories > 0);
  const daysTracked = daysWithData.length;

  const totals = dailyBreakdown.reduce(
    (acc, d) => ({
      calories: acc.calories + d.calories,
      protein: Math.round((acc.protein + d.protein) * 10) / 10,
      carbs: Math.round((acc.carbs + d.carbs) * 10) / 10,
      fat: Math.round((acc.fat + d.fat) * 10) / 10,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const report = {
    startDate: startStr,
    endDate: endStr,
    daysTracked,
    totals,
    avgDailyCalories: daysTracked > 0 ? Math.round(totals.calories / daysTracked) : 0,
    avgDailyProtein: daysTracked > 0 ? Math.round((totals.protein / daysTracked) * 10) / 10 : 0,
    avgDailyCarbs: daysTracked > 0 ? Math.round((totals.carbs / daysTracked) * 10) / 10 : 0,
    avgDailyFat: daysTracked > 0 ? Math.round((totals.fat / daysTracked) * 10) / 10 : 0,
    goals: defaultGoal,
    dailyBreakdown,
  };

  await cacheSet(cacheKey, report, REPORT_CACHE_TTL);

  return res.status(200).json({ success: true, cached: false, data: report });
});

/**
 * GET /api/reports/analytics
 * Returns comprehensive multi-period analytics (7d, 15d, custom, mealType filter).
 * Cached in Redis by analyticsReportKey (TTL 1 hour).
 */
exports.getAnalyticsReport = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { startDate, endDate, mealType } = req.query;

  let start, end;
  if (startDate && endDate) {
    const sParts = startDate.split('T')[0].split('-').map(Number);
    start = new Date(sParts[0], sParts[1] - 1, sParts[2], 0, 0, 0, 0);

    const eParts = endDate.split('T')[0].split('-').map(Number);
    end = new Date(eParts[0], eParts[1] - 1, eParts[2], 23, 59, 59, 999);
  } else {
    // Default to last 7 days
    end = new Date();
    end.setHours(23, 59, 59, 999);
    start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
  }

  const startStr = getLocalDateString(start);
  const endStr = getLocalDateString(end);
  const activeMealType = mealType && mealType !== 'All' ? mealType : 'All';

  const cacheKey = analyticsReportKey(userId, startStr, endStr, activeMealType);
  const cached = await cacheGet(cacheKey);

  if (cached) {
    console.log(`[Cache] HIT  analytics_report for user ${userId} (${startStr}→${endStr}, ${activeMealType})`);
    return res.status(200).json({ success: true, cached: true, data: cached });
  }

  console.log(`[Cache] MISS analytics_report for user ${userId} (${startStr}→${endStr}, ${activeMealType}) — querying DB`);

  const mealWhere = {
    userId,
    date: { gte: start, lte: end },
  };
  if (activeMealType !== 'All') {
    mealWhere.mealType = activeMealType;
  }

  const [meals, goals] = await Promise.all([
    prisma.meal.findMany({
      where: mealWhere,
      orderBy: { date: 'asc' },
    }),
    prisma.goal.findMany({
      where: {
        userId,
        OR: [{ date: null }, { date: { gte: startStr, lte: endStr } }],
      },
    }),
  ]);

  const defaultGoal = goals.find((g) => g.date === null) || goals[0] || null;
  const todayStr = getLocalDateString(new Date());

  const dailyData = [];
  let current = new Date(start);

  while (current <= end) {
    const key = getLocalDateString(current);
    const specificGoal = goals.find((g) => g.date === key);

    const targetCalories = specificGoal ? specificGoal.targetCalories : (defaultGoal?.targetCalories || 2000);
    const targetProtein = specificGoal ? specificGoal.targetProtein : (defaultGoal?.targetProtein || 150);
    const targetCarbs = specificGoal ? specificGoal.targetCarbs : (defaultGoal?.targetCarbs || 200);
    const targetFat = specificGoal ? specificGoal.targetFat : (defaultGoal?.targetFat || 65);

    const dayMeals = meals.filter((m) => getLocalDateString(m.date) === key);
    const dayTotals = dayMeals.reduce(
      (acc, m) => ({
        calories: acc.calories + (m.calories || 0),
        protein: Math.round((acc.protein + (m.protein || 0)) * 10) / 10,
        carbs: Math.round((acc.carbs + (m.carbs || 0)) * 10) / 10,
        fat: Math.round((acc.fat + (m.fat || 0)) * 10) / 10,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    dailyData.push({
      name: current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: key,
      isToday: key === todayStr,
      calories: dayTotals.calories,
      protein: dayTotals.protein,
      carbs: dayTotals.carbs,
      fat: dayTotals.fat,
      target: targetCalories,
      targetProtein,
      targetCarbs,
      targetFat,
      meals: dayMeals,
    });

    current.setDate(current.getDate() + 1);
  }

  const totalDays = dailyData.length || 1;
  let totalCals = 0, totalP = 0, totalC = 0, totalF = 0;
  let targetCals = 0, targetP = 0, targetC = 0, targetF = 0;

  dailyData.forEach((d) => {
    totalCals += d.calories;
    totalP += d.protein;
    totalC += d.carbs;
    totalF += d.fat;
    targetCals += d.target;
    targetP += d.targetProtein;
    targetC += d.targetCarbs;
    targetF += d.targetFat;
  });

  const summaryData = {
    calories: Math.round(totalCals / totalDays),
    protein: Math.round((totalP / totalDays) * 10) / 10,
    carbs: Math.round((totalC / totalDays) * 10) / 10,
    fat: Math.round((totalF / totalDays) * 10) / 10,
    targetCalories: Math.round(targetCals / totalDays),
    targetProtein: Math.round((targetP / totalDays) * 10) / 10,
    targetCarbs: Math.round((targetC / totalDays) * 10) / 10,
    targetFat: Math.round((targetF / totalDays) * 10) / 10,
  };

  const todayItem = dailyData.find((d) => d.isToday);
  const todayMacros = todayItem
    ? { protein: todayItem.protein, carbs: todayItem.carbs, fat: todayItem.fat }
    : { protein: 0, carbs: 0, fat: 0 };

  const report = {
    startDate: startStr,
    endDate: endStr,
    mealType: activeMealType,
    daysTracked: dailyData.filter((d) => d.calories > 0).length,
    totalMeals: meals.length,
    dailyData,
    summaryData,
    todayMacros,
    goals: defaultGoal,
    allGoals: goals,
    meals,
  };

  await cacheSet(cacheKey, report, REPORT_CACHE_TTL);

  return res.status(200).json({ success: true, cached: false, data: report });
});

// Backward compatibility placeholder
exports.getReports = asyncHandler(async (req, res, next) => {
  const { page, limit } = req.query;
  res.status(200).json({ message: 'getReports placeholder', pagination: { page, limit } });
});
