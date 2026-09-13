const prisma = require('../config/db');
const { invalidateWeeklyReportCache } = require('../utils/cacheUtils');

exports.addMeal = async (userId, data) => {
  const meal = await prisma.meal.create({
    data: { ...data, userId },
  });
  // Invalidate this user's cached weekly reports — data has changed
  await invalidateWeeklyReportCache(userId);
  return meal;
};

exports.getUserMeals = async (userId, options = {}) => {
  const where = { userId };
  
  if (options.startDate && options.endDate) {
    const start = new Date(options.startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(options.endDate);
    end.setHours(23, 59, 59, 999);
    where.date = { gte: start, lte: end };
  } else if (options.dateStr) {
    const startDate = new Date(options.dateStr);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(options.dateStr);
    endDate.setHours(23, 59, 59, 999);
    where.date = { gte: startDate, lte: endDate };
  }

  if (options.mealType && options.mealType !== 'All') {
    where.mealType = options.mealType;
  }

  const query = {
    where,
    orderBy: { date: 'desc' },
  };

  if (options.page && options.limit) {
    const page = parseInt(options.page, 10);
    const limit = parseInt(options.limit, 10);
    query.skip = (page - 1) * limit;
    query.take = limit;
  }

  const [meals, total] = await Promise.all([
    prisma.meal.findMany(query),
    prisma.meal.count({ where })
  ]);

  return { meals, total };
};

exports.updateMeal = async (userId, mealId, data) => {
  const id = parseInt(mealId, 10);
  const uid = parseInt(userId, 10);
  const existing = await prisma.meal.findFirst({ where: { id, userId: uid } });
  if (!existing) throw new Error('Meal not found or unauthorized');

  const updated = await prisma.meal.update({ where: { id }, data });
  // Invalidate this user's cached weekly reports — data has changed
  await invalidateWeeklyReportCache(userId);
  return updated;
};

exports.deleteMeal = async (userId, mealId) => {
  const id = parseInt(mealId, 10);
  const uid = parseInt(userId, 10);
  const existing = await prisma.meal.findFirst({ where: { id, userId: uid } });
  if (!existing) throw new Error('Meal not found or unauthorized');

  const deleted = await prisma.meal.delete({ where: { id } });
  // Invalidate this user's cached weekly reports — data has changed
  await invalidateWeeklyReportCache(userId);
  return deleted;
};
