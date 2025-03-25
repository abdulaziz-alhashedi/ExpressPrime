beforeAll(async () => {
  const { prisma } = require('../../src/utils/prisma');
  await prisma.$connect();
  // ...additional global test initialization...
});

afterAll(async () => {
  const { prisma } = require('../../src/utils/prisma');
  await prisma.$disconnect();
  // ...additional test teardown...
});
