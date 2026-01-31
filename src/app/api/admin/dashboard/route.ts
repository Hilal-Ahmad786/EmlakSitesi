import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/admin/dashboard
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    // Return only activities
    if (type === 'activities') {
      const limit = parseInt(searchParams.get('limit') || '10');
      const activities = await prisma.activityLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      });
      return NextResponse.json(activities);
    }

    // Return full dashboard stats
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      totalProperties,
      activeProperties,
      totalLeads,
      recentLeads,
      viewCountResult,
      recentActivities,
      recentLeadsList,
      topProperties,
    ] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({ where: { status: 'PUBLISHED' } }),
      prisma.lead.count(),
      prisma.lead.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.property.aggregate({ _sum: { viewCount: true } }),
      prisma.activityLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.lead.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          property: { select: { id: true, title: true } },
          assignedTo: { select: { id: true, name: true } },
        },
      }),
      prisma.property.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { viewCount: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          city: true,
          neighborhood: true,
          price: true,
          viewCount: true,
          inquiryCount: true,
          status: true,
        },
      }),
    ]);

    return NextResponse.json({
      totalProperties,
      activeProperties,
      totalLeads,
      recentLeads,
      totalViews: viewCountResult._sum.viewCount || 0,
      recentActivities,
      recentLeadsList,
      topProperties,
    });
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
