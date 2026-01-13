import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// MOCK PRISMA CLIENT FOR DETACHED/BUILD MODE
// This prevents "PrismaClientInitializationError" during build when DB is not available
const prismaMock = new Proxy({}, {
  get: (target, prop) => {
    // Return a function that returns a promise for any method call (findMany, create, etc.)
    return new Proxy(() => Promise.resolve([]), {
      get: (target, prop) => {
        return () => Promise.resolve([]);
      }
    });
  }
}) as unknown as PrismaClient;

export const prisma = prismaMock;

/* ORIGINAL IMPLEMENTATION - RESTORE WHEN CONNECTING TO REAL DB
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
*/
