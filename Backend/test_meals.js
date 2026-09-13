const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const meals = await prisma.meal.findMany();
  console.log(JSON.stringify(meals, null, 2));
}
main().finally(() => prisma.$disconnect());
