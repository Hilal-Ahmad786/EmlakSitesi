import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET - List all blog posts with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const locale = searchParams.get('locale') || 'en';

    const where: any = {};

    if (status) where.status = status;
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: {
            select: { id: true, name: true, avatar: true },
          },
          seo: true,
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// POST - Create a new blog post
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Generate slug from title
    const slug = body.slug || body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const locale = body.locale || 'en';

    const post = await prisma.blogPost.create({
      data: {
        title: { [locale]: body.title },
        slug,
        excerpt: body.excerpt ? { [locale]: body.excerpt } : undefined,
        content: { [locale]: body.content },
        featuredImage: body.featuredImage,
        category: body.category,
        tags: body.tags || [],
        status: body.status || 'DRAFT',
        authorId: session.user.id!,
        publishedAt: body.status === 'PUBLISHED' ? new Date() : null,
        seo: body.seo ? {
          create: {
            metaTitle: { [locale]: body.seo.metaTitle || body.title },
            metaDescription: { [locale]: body.seo.metaDescription || body.excerpt },
            ogImage: body.seo.ogImage || body.featuredImage,
          },
        } : undefined,
      },
      include: {
        author: {
          select: { id: true, name: true },
        },
        seo: true,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'BLOG_POST_CREATED',
        entityType: 'BlogPost',
        entityId: post.id,
        details: `Created blog post: ${post.title}`,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
