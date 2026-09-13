const prisma = require('../config/db');
const { invalidateWeeklyReportCache } = require('../utils/cacheUtils');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.createOrUpdateGoal = asyncHandler(async (req, res, next) => {
    const { targetWeight, currentWeight, targetCalories, date } = req.body;
    const userId = req.user.id;
    
    // date should be either a specific YYYY-MM-DD string or null for default
    const goalDate = date || null;

    // Check if user already has a goal for this exact date (or null)
    let goal = await prisma.goal.findFirst({
      where: { userId, date: goalDate }
    });

    if (goal) {
      goal = await prisma.goal.update({
        where: { id: goal.id },
        data: { targetWeight, currentWeight, targetCalories }
      });
    } else {
      goal = await prisma.goal.create({
        data: { targetWeight, currentWeight, targetCalories, date: goalDate, userId }
      });
    }

    // Invalidate this user's cached weekly reports — goal changes affect report targets
    await invalidateWeeklyReportCache(userId);
    res.status(200).json({ success: true, data: goal });
});

exports.getGoals = asyncHandler(async (req, res, next) => {
    const { date } = req.query;
    const userId = req.user.id;
    
    let goal = null;
    
    // If a specific date is requested, try to find that specific goal
    if (date) {
      goal = await prisma.goal.findFirst({
        where: { userId, date }
      });
    }
    
    // If no goal found for that date, or no date was provided, fetch the default goal
    if (!goal) {
      goal = await prisma.goal.findFirst({
        where: { userId, date: null }
      });
    }
    
    // If still no goal found, fallback to any goal (legacy support)
    if (!goal) {
      goal = await prisma.goal.findFirst({
        where: { userId }
      });
    }
    
    if (!goal) {
      return res.status(200).json({ success: true, data: null, message: 'Goal not found' });
    }

    res.status(200).json({ success: true, data: goal });
});

exports.getGoalsRange = asyncHandler(async (req, res, next) => {
    const { startDate, endDate } = req.query;
    const userId = req.user.id;
    
    // Parse ISO dates to YYYY-MM-DD
    const startStr = startDate ? startDate.split('T')[0] : null;
    const endStr = endDate ? endDate.split('T')[0] : null;

    const whereClause = {
      userId,
      OR: [
        { date: null }
      ]
    };
    
    if (startStr && endStr) {
      whereClause.OR.push({ date: { gte: startStr, lte: endStr } });
    }
    
    // Fetch all goals for the user, both default (null) and specific dates in range
    const goals = await prisma.goal.findMany({
      where: whereClause
    });
    
    res.status(200).json({ success: true, data: goals });
});
