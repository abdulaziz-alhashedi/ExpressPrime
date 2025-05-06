import { prisma } from '../../src/utils/prisma';

// Global test timeout (30 seconds)
jest.setTimeout(30000);

// Suppress console output during tests
beforeAll(() => {
  // Store original console methods
  const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info
  };

  // Replace with no-op functions for tests
  if (process.env.NODE_ENV === 'test') {
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
    console.info = jest.fn();
  }

  // Connect to the database
  return prisma.$connect();
});

// Clean up after all tests
afterAll(async () => {
  // Disconnect from the database
  await prisma.$disconnect();
});

// Reset mocks between tests
afterEach(() => {
  jest.clearAllMocks();
});
