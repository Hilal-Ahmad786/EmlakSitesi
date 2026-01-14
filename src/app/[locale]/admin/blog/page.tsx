'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { BlogList, BlogForm, BlogPost } from '@/components/admin/blog/BlogComponents';
import { Plus } from 'lucide-react';

// Mock data for blog posts
const mockPosts: BlogPost[] = [
    {
        id: '1',
        title: 'Investment Opportunities in Istanbul Real Estate 2024',
        slug: 'investment-opportunities-istanbul-2024',
        excerpt: 'Discover the best investment opportunities in Istanbul real estate market this year.',
        content: 'Full article content here...',
        featuredImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800',
        author: { id: '1', name: 'Ahmet Yilmaz' },
        category: 'Investment Tips',
        tags: ['investment', 'istanbul', '2024'],
        status: 'published',
        publishedAt: '2024-12-10',
        createdAt: '2024-12-08',
        updatedAt: '2024-12-10',
        views: 1245,
    },
    {
        id: '2',
        title: 'Guide to Bebek: Istanbul\'s Most Prestigious Neighborhood',
        slug: 'guide-to-bebek-istanbul',
        excerpt: 'Everything you need to know about living in Bebek, one of Istanbul\'s most exclusive areas.',
        content: 'Full article content here...',
        featuredImage: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800',
        author: { id: '1', name: 'Ahmet Yilmaz' },
        category: 'Neighborhood Guide',
        tags: ['bebek', 'neighborhood', 'lifestyle'],
        status: 'published',
        publishedAt: '2024-11-25',
        createdAt: '2024-11-20',
        updatedAt: '2024-11-25',
        views: 892,
    },
    {
        id: '3',
        title: 'Turkish Citizenship by Investment: Complete Guide',
        slug: 'turkish-citizenship-investment-guide',
        excerpt: 'Learn about the requirements and process for obtaining Turkish citizenship through real estate investment.',
        content: 'Full article content here...',
        featuredImage: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800',
        author: { id: '2', name: 'Elif Kaya' },
        category: 'Legal & Finance',
        tags: ['citizenship', 'investment', 'legal'],
        status: 'draft',
        createdAt: '2024-12-01',
        updatedAt: '2024-12-05',
        views: 0,
    },
    {
        id: '4',
        title: 'Market Report: Q4 2024 Istanbul Property Prices',
        slug: 'market-report-q4-2024',
        excerpt: 'Quarterly analysis of Istanbul property market trends and price movements.',
        content: 'Full article content here...',
        author: { id: '1', name: 'Ahmet Yilmaz' },
        category: 'Market Insights',
        tags: ['market', 'prices', 'analysis'],
        status: 'scheduled',
        scheduledAt: '2024-12-20T09:00:00',
        createdAt: '2024-12-05',
        updatedAt: '2024-12-05',
        views: 0,
    },
];

export default function BlogPage(props: { params: Promise<{ locale: string }> }) {
    const params = use(props.params);
    const { locale } = params;
    const router = useRouter();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | undefined>();
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
    });

    useEffect(() => {
        fetchPosts();
    }, [pagination.page]);

    const fetchPosts = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        setPosts(mockPosts);
        setPagination((prev) => ({ ...prev, totalPages: 1 }));
        setLoading(false);
    };

    const handleEdit = (id: string) => {
        const post = posts.find((p) => p.id === id);
        if (post) {
            setEditingPost(post);
            setShowForm(true);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        setPosts(posts.filter((p) => p.id !== id));
    };

    const handleTogglePublish = async (id: string) => {
        setPosts(
            posts.map((p) =>
                p.id === id
                    ? { ...p, status: p.status === 'published' ? 'draft' : 'published' }
                    : p
            )
        );
    };

    const handleView = (id: string) => {
        const post = posts.find((p) => p.id === id);
        if (post) {
            window.open(`/${locale}/blog/${post.slug}`, '_blank');
        }
    };

    const handleFormSubmit = async (data: any) => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (editingPost) {
            setPosts(
                posts.map((p) =>
                    p.id === editingPost.id
                        ? { ...p, ...data, updatedAt: new Date().toISOString() }
                        : p
                )
            );
        } else {
            const newPost: BlogPost = {
                id: String(Date.now()),
                ...data,
                author: { id: '1', name: 'Admin User' },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                views: 0,
            };
            setPosts([newPost, ...posts]);
        }

        setShowForm(false);
        setEditingPost(undefined);
        setLoading(false);
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingPost(undefined);
    };

    return (
        <AdminLayout locale={locale}>
            <div className="space-y-6">
                {showForm ? (
                    <BlogForm
                        post={editingPost}
                        onSubmit={handleFormSubmit}
                        onCancel={handleFormCancel}
                        loading={loading}
                    />
                ) : (
                    <>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Manage your blog posts and articles
                                </p>
                            </div>
                            <button
                                onClick={() => setShowForm(true)}
                                className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                            >
                                <Plus size={20} className="mr-2" />
                                New Post
                            </button>
                        </div>

                        <BlogList
                            posts={posts}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onTogglePublish={handleTogglePublish}
                            onView={handleView}
                            loading={loading}
                            pagination={{
                                ...pagination,
                                onPageChange: (page) => setPagination((prev) => ({ ...prev, page })),
                            }}
                        />
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
