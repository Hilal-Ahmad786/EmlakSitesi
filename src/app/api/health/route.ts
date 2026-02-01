import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const checks: Record<string, any> = {
    env: {
      DATABASE_URL: !!process.env.DATABASE_URL,
      DIRECT_URL: !!process.env.DIRECT_URL,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NODE_ENV: process.env.NODE_ENV,
    },
    database: 'checking...',
    counts: {},
  };

  try {
    // Test database connectivity
    const result = await prisma.$queryRaw`SELECT 1 as ok`;
    checks.database = 'connected';

    // Get basic counts
    const [propertyCount, neighborhoodCount, imageCount] = await Promise.all([
      prisma.property.count(),
      prisma.neighborhood.count(),
      prisma.propertyImage.count(),
    ]);

    checks.counts = { properties: propertyCount, neighborhoods: neighborhoodCount, images: imageCount };
  } catch (error: any) {
    checks.database = `error: ${error.message}`;
  }

  return NextResponse.json(checks);
}
