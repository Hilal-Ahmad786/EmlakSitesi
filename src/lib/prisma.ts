import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Check if we're in a build environment without database
const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL;

// Create a mock client for build time only
const createMockClient = () => {
  return new Proxy({} as PrismaClient, {
    get: (target, prop) => {
      if (prop === '$connect' || prop === '$disconnect') {
        return () => Promise.resolve();
      }
      return new Proxy(() => Promise.resolve(null), {
        get: () => () => Promise.resolve([]),
      });
    },
  });
};

// Use real Prisma client in runtime, mock only during build without DB
export const prisma: PrismaClient = isBuildTime
  ? createMockClient()
  : globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
