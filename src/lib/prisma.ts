import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Reuse client across hot reloads in dev AND across invocations in production serverless
export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// Cache in all environments to prevent connection pool exhaustion on serverless
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}
