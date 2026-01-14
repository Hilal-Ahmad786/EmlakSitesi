import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { z } from 'zod';

const collectionSchema = z.object({
  title: z.object({
    en: z.string().min(1, 'English title is required'),
    tr: z.string().min(1, 'Turkish title is required'),
  }),
  description: z.object({
    en: z.string().optional(),
    tr: z.string().optional(),
  }).optional(),
  image: z.string().optional().nullable(),
  link: z.string().min(1, 'Link is required'),
  propertyCount: z.number().optional().default(0),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
  order: z.number().optional().default(0),
});

// GET - List all collections (admin)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes((session.user as any).role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');

    const where: any = {};

    if (search) {
      where.OR = [
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [collections, total] = await Promise.all([
      prisma.collection.findMany({
        where,
        orderBy: { order: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.collection.count({ where }),
    ]);

    return NextResponse.json({
      collections,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}

// POST - Create a new collection
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes((session.user as any).role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = collectionSchema.parse(body);

    // Generate slug from English title
    const slug = validated.title.en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingCollection = await prisma.collection.findUnique({
      where: { slug },
    });

    if (existingCollection) {
      return NextResponse.json(
        { error: 'A collection with this name already exists' },
        { status: 400 }
      );
    }

    const collection = await prisma.collection.create({
      data: {
        title: validated.title,
        slug,
        description: validated.description,
        image: validated.image,
        link: validated.link,
        propertyCount: validated.propertyCount,
        isActive: validated.isActive,
        isFeatured: validated.isFeatured,
        order: validated.order,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'COLLECTION_CREATED',
        entityType: 'Collection',
        entityId: collection.id,
        details: `Created collection: ${validated.title.en}`,
      },
    });

    return NextResponse.json(collection, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating collection:', error);
    return NextResponse.json(
      { error: 'Failed to create collection' },
      { status: 500 }
    );
  }
}
