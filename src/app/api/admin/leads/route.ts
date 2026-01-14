import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET - List all leads with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const search = searchParams.get('search');

    const where: any = {};

    if (status) where.status = status;
    if (source) where.source = source;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          assignedTo: {
            select: { id: true, name: true, email: true },
          },
          property: {
            select: { id: true, title: true },
          },
        },
      }),
      prisma.lead.count({ where }),
    ]);

    return NextResponse.json({
      leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

// POST - Create a new lead
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const lead = await prisma.lead.create({
      data: {
        name: body.name || `${body.firstName || ''} ${body.lastName || ''}`.trim(),
        email: body.email,
        phone: body.phone,
        subject: body.subject,
        message: body.message,
        source: body.source || 'ADMIN',
        status: body.status || 'NEW',
        propertyId: body.propertyId,
        assignedToId: body.assignedToId,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'LEAD_CREATED',
        entityType: 'Lead',
        entityId: lead.id,
        details: `Created lead for ${lead.email}`,
      },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}

// PATCH - Update lead status (bulk update)
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { ids, status, assignedToId } = body;

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { error: 'Invalid lead IDs' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (assignedToId) updateData.assignedToId = assignedToId;

    await prisma.lead.updateMany({
      where: { id: { in: ids } },
      data: updateData,
    });

    return NextResponse.json({ success: true, updated: ids.length });
  } catch (error) {
    console.error('Error updating leads:', error);
    return NextResponse.json(
      { error: 'Failed to update leads' },
      { status: 500 }
    );
  }
}
