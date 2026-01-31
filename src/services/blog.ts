'use server';

import { prisma } from '@/lib/prisma';

interface BlogListParams {
  page?: number;
  limit?: number;
  category?: string;
}

export async function getBlogPosts(params: BlogListParams = {}) {
  const { page = 1, limit = 12, category } = params;

  const where: any = {
    status: 'PUBLISHED',
  };

  if (category) {
    where.category = category;
  }

  try {
    const [items, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: {
            select: { id: true, name: true, avatar: true },
          },
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return {
      data: items.map(transformBlogPost),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return { data: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } };
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
        seo: true,
      },
    });

    if (!post || post.status !== 'PUBLISHED') {
      return null;
    }

    // Increment view count
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });

    return transformBlogPost(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

function transformBlogPost(item: any) {
  const getLoc = (json: any) => {
    if (!json) return '';
    if (typeof json === 'string') return json;
    return json.tr || json.en || '';
  };

  return {
    id: item.id,
    slug: item.slug,
    title: getLoc(item.title),
    excerpt: getLoc(item.excerpt),
    content: getLoc(item.content),
    featuredImage: item.featuredImage || '/images/placeholder.jpg',
    category: item.category || '',
    tags: Array.isArray(item.tags) ? item.tags : [],
    author: item.author?.name || '',
    authorAvatar: item.author?.avatar || '',
    date: item.publishedAt
      ? new Date(item.publishedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : '',
    createdAt: item.createdAt?.toISOString(),
  };
}
