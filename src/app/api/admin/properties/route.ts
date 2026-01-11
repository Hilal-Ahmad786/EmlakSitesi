import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/admin/properties - List all properties
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { path: ['en'], string_contains: search } },
        { title: { path: ['tr'], string_contains: search } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          images: { orderBy: { order: 'asc' } },
          neighborhoodRef: true,
          seo: true,
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.property.count({ where }),
    ]);

    return NextResponse.json({
      data: properties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Failed to fetch properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

// POST /api/admin/properties - Create a new property
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const property = await prisma.property.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        propertyType: data.propertyType,
        listingType: data.listingType,
        status: data.status || 'DRAFT',
        price: data.price,
        currency: data.currency || 'EUR',
        pricePerSqm: data.pricePerSqm,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        size: data.size,
        landSize: data.landSize || data.lotSize, // Mapped
        yearBuilt: data.yearBuilt,
        floor: data.floor,
        floors: data.floors || data.totalFloors, // Mapped
        // parkingSpaces: data.parkingSpaces, // Removed (not in model)
        features: data.features || [],
        address: data.address, // Restored
        neighborhood: data.neighborhood, // Restored
        // location: data.location, // Removed (not in model)
        latitude: data.latitude,
        longitude: data.longitude,
        neighborhoodId: data.neighborhoodId,
        isFeatured: data.isFeatured || false,
        isNew: data.isNew || true,
        videoUrl: data.videoUrl,
        virtualTourUrl: data.virtualTourUrl,
        agentId: session?.user?.id || 'unknown',

        images: {
          create: (data.images || []).map((img: any, index: number) => ({
            url: img.url,
            alt: img.alt,
            order: index,
          })),
        },
        seo: data.seo ? {
          create: {
            metaTitle: data.seo.metaTitle,
            metaDescription: data.seo.metaDescription,
            keywords: data.seo.keywords,
            ogImage: data.seo.ogImage,
            canonicalUrl: data.seo.canonicalUrl,
            noIndex: data.seo.noIndex || false,
            noFollow: data.seo.noFollow || false,
            schemaMarkup: data.seo.schema,
          },
        } : undefined,
      },
      include: {
        images: true,
        neighborhoodRef: true,
        seo: true,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'CREATE',
        entityType: 'PROPERTY',
        entityId: property.id,
        userId: session?.user?.id || 'unknown',
        details: { title: data.title },
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Failed to create property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}
