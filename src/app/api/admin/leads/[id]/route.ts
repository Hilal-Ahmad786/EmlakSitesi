import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/admin/leads/[id]
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const lead = await prisma.lead.findUnique({
      where: { id: params.id },
      include: {
        property: {
          select: { id: true, title: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error('Failed to fetch lead:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/leads/[id]
export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const updateData: any = {};
    if (data.status !== undefined) {
      updateData.status = data.status;
      if (data.status === 'CLOSED_WON' || data.status === 'CLOSED_LOST') {
        updateData.closedAt = new Date();
      }
    }
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.assignedToId !== undefined) updateData.assignedToId = data.assignedToId;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.followUpDate !== undefined) updateData.followUpDate = data.followUpDate ? new Date(data.followUpDate) : null;

    const lead = await prisma.lead.update({
      where: { id: params.id },
      data: updateData,
      include: {
        property: {
          select: { id: true, title: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'Lead',
        entityId: lead.id,
        userId: session.user.id,
        details: { status: data.status },
      },
    });

    return NextResponse.json(lead);
  } catch (error) {
    console.error('Failed to update lead:', error);
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/leads/[id]
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.lead.delete({
      where: { id: params.id },
    });

    await prisma.activityLog.create({
      data: {
        action: 'DELETE',
        entityType: 'Lead',
        entityId: params.id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete lead:', error);
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}
