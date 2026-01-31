'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { BlogList, BlogForm, BlogPost } from '@/components/admin/blog/BlogComponents';
import { Plus } from 'lucide-react';
import { blogApi } from '@/lib/admin/api';

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
        try {
            const result = await blogApi.getAll({ page: pagination.page, pageSize: 10 });
            const postsData = (result as any).posts || (result as any).data || [];
            setPosts(postsData.map((p: any) => ({
                id: p.id,
                title: typeof p.title === 'object' ? (p.title.en || p.title.tr || '') : p.title,
                slug: p.slug,
                excerpt: typeof p.excerpt === 'object' ? (p.excerpt?.en || p.excerpt?.tr || '') : (p.excerpt || ''),
                content: typeof p.content === 'object' ? (p.content.en || p.content.tr || '') : p.content,
                featuredImage: p.featuredImage,
                author: p.author || { id: '', name: '' },
                category: p.category || '',
                tags: Array.isArray(p.tags) ? p.tags : [],
                status: p.status === 'PUBLISHED' ? 'published' : p.status === 'DRAFT' ? 'draft' : p.status?.toLowerCase() || 'draft',
                publishedAt: p.publishedAt,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
                views: p.viewCount || 0,
            })));
            const pag = (result as any).pagination;
            if (pag) {
                setPagination((prev) => ({ ...prev, totalPages: pag.totalPages || 1 }));
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            setPosts([]);
        }
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
        try {
            await blogApi.delete(id);
            setPosts(posts.filter((p) => p.id !== id));
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    const handleTogglePublish = async (id: string) => {
        const post = posts.find((p) => p.id === id);
        if (!post) return;
        const newStatus = post.status === 'published' ? 'DRAFT' : 'PUBLISHED';
        try {
            await blogApi.update(id, { status: newStatus } as any);
            setPosts(
                posts.map((p) =>
                    p.id === id
                        ? { ...p, status: newStatus === 'PUBLISHED' ? 'published' : 'draft' }
                        : p
                )
            );
        } catch (error) {
            console.error('Failed to toggle publish:', error);
        }
    };

    const handleView = (id: string) => {
        const post = posts.find((p) => p.id === id);
        if (post) {
            window.open(`/${locale}/blog/${post.slug}`, '_blank');
        }
    };

    const handleFormSubmit = async (data: any) => {
        setLoading(true);
        try {
            const payload: any = {
                title: data.title,
                slug: data.slug,
                content: data.content,
                excerpt: data.excerpt,
                featuredImage: data.featuredImage,
                category: data.category,
                tags: data.tags,
                status: data.status === 'published' ? 'PUBLISHED' : 'DRAFT',
            };

            if (editingPost) {
                await blogApi.update(editingPost.id, payload);
            } else {
                await blogApi.create(payload);
            }

            await fetchPosts();
        } catch (error) {
            console.error('Failed to save post:', error);
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
