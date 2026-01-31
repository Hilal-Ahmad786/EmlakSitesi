import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/admin/neighborhoods/[id]
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

    const neighborhood = await prisma.neighborhood.findUnique({
      where: { id: params.id },
      include: {
        seo: true,
        _count: {
          select: { properties: true },
        },
      },
    });

    if (!neighborhood) {
      return NextResponse.json({ error: 'Neighborhood not found' }, { status: 404 });
    }

    return NextResponse.json(neighborhood);
  } catch (error) {
    console.error('Failed to fetch neighborhood:', error);
    return NextResponse.json(
      { error: 'Failed to fetch neighborhood' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/neighborhoods/[id]
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
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.district !== undefined) updateData.district = data.district;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.images !== undefined) updateData.images = data.images;
    if (data.highlights !== undefined) updateData.highlights = data.highlights;
    if (data.lifestyle !== undefined) updateData.lifestyle = data.lifestyle;
    if (data.latitude !== undefined) updateData.latitude = data.latitude;
    if (data.longitude !== undefined) updateData.longitude = data.longitude;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
    if (data.order !== undefined) updateData.order = data.order;

    if (data.seo) {
      updateData.seo = {
        upsert: {
          create: {
            metaTitle: data.seo.metaTitle,
            metaDescription: data.seo.metaDescription,
            keywords: data.seo.keywords,
            ogImage: data.seo.ogImage,
          },
          update: {
            metaTitle: data.seo.metaTitle,
            metaDescription: data.seo.metaDescription,
            keywords: data.seo.keywords,
            ogImage: data.seo.ogImage,
          },
        },
      };
    }

    const neighborhood = await prisma.neighborhood.update({
      where: { id: params.id },
      data: updateData,
      include: {
        seo: true,
        _count: {
          select: { properties: true },
        },
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'Neighborhood',
        entityId: neighborhood.id,
        userId: session.user.id,
        details: { name: data.name },
      },
    });

    return NextResponse.json(neighborhood);
  } catch (error) {
    console.error('Failed to update neighborhood:', error);
    return NextResponse.json(
      { error: 'Failed to update neighborhood' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/neighborhoods/[id]
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

    await prisma.neighborhood.delete({
      where: { id: params.id },
    });

    await prisma.activityLog.create({
      data: {
        action: 'DELETE',
        entityType: 'Neighborhood',
        entityId: params.id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete neighborhood:', error);
    return NextResponse.json(
      { error: 'Failed to delete neighborhood' },
      { status: 500 }
    );
  }
}
