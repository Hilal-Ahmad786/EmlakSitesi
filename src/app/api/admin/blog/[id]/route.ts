import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/admin/blog/[id]
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

    const post = await prisma.blogPost.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
        seo: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Failed to fetch blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/blog/[id]
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
    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
    if (data.status !== undefined) {
      updateData.status = data.status;
      if (data.status === 'PUBLISHED') {
        updateData.publishedAt = new Date();
      }
    }
    if (data.category !== undefined) updateData.category = data.category;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.featuredImage !== undefined) updateData.featuredImage = data.featuredImage;

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

    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: updateData,
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
        seo: true,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'BlogPost',
        entityId: post.id,
        userId: session.user.id,
        details: { title: data.title },
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Failed to update blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/blog/[id]
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

    await prisma.blogPost.delete({
      where: { id: params.id },
    });

    await prisma.activityLog.create({
      data: {
        action: 'DELETE',
        entityType: 'BlogPost',
        entityId: params.id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
