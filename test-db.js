const { PrismaClient } = require('./apps/web/node_modules/@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log("Users:", users);
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
