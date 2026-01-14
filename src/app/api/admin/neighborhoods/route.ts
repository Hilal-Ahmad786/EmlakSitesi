import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET - List all neighborhoods
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    const locale = searchParams.get('locale') || 'en';

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [neighborhoods, total] = await Promise.all([
      prisma.neighborhood.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          seo: true,
          _count: {
            select: { properties: true },
          },
        },
      }),
      prisma.neighborhood.count({ where }),
    ]);

    return NextResponse.json({
      neighborhoods,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching neighborhoods:', error);
    return NextResponse.json(
      { error: 'Failed to fetch neighborhoods' },
      { status: 500 }
    );
  }
}

// POST - Create a new neighborhood
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const locale = body.locale || 'en';

    // Generate slug from name
    const slug = body.slug || body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const neighborhood = await prisma.neighborhood.create({
      data: {
        name: { [locale]: body.name },
        slug,
        city: body.city || 'Istanbul',
        description: body.description ? { [locale]: body.description } : undefined,
        shortDescription: body.shortDescription ? { [locale]: body.shortDescription } : undefined,
        image: body.featuredImage,
        images: body.gallery || [],
        highlights: body.highlights || [],
        lifestyle: body.lifestyle ? { [locale]: body.lifestyle } : undefined,
        latitude: body.latitude,
        longitude: body.longitude,
        isActive: body.isActive ?? true,
        seo: body.seo ? {
          create: {
            metaTitle: { [locale]: body.seo.metaTitle || body.name },
            metaDescription: { [locale]: body.seo.metaDescription || body.shortDescription },
            ogImage: body.seo.ogImage || body.featuredImage,
          },
        } : undefined,
      },
      include: {
        seo: true,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'NEIGHBORHOOD_CREATED',
        entityType: 'Neighborhood',
        entityId: neighborhood.id,
        details: `Created neighborhood: ${neighborhood.name}`,
      },
    });

    return NextResponse.json(neighborhood, { status: 201 });
  } catch (error) {
    console.error('Error creating neighborhood:', error);
    return NextResponse.json(
      { error: 'Failed to create neighborhood' },
      { status: 500 }
    );
  }
}
