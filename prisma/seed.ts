import { prisma } from '../src/utils/prisma';

async function main() {
  console.log("Seeding database...");
  // TODO: Add your seed data logic here.
  // e.g., await prisma.user.create({ data: { email: "user@example.com", password: "secure", role: "USER" } })
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });