const { PrismaClient } = require('@prisma/client');
const { isToday } = require('./src/utils/dateUtils');
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.meal.findFirst({ where: { id: 45 } });
  console.log('Meal 45 date:', existing.date);
  console.log('isToday(existing.date):', isToday(existing.date));
}

main().finally(() => prisma.$disconnect());
