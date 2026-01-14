'use client';

import { use, useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { CollectionList, CollectionForm, Collection } from '@/components/admin/collections/CollectionComponents';
import { Plus } from 'lucide-react';

export default function CollectionsPage(props: { params: Promise<{ locale: string }> }) {
    const params = use(props.params);
    const { locale } = params;
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCollection, setEditingCollection] = useState<Collection | undefined>();
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
    });

    useEffect(() => {
        fetchCollections();
    }, [pagination.page]);

    const fetchCollections = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/collections?page=${pagination.page}&limit=20`);
            if (response.ok) {
                const data = await response.json();
                setCollections(data.collections || []);
                setPagination((prev) => ({
                    ...prev,
                    totalPages: data.pagination?.totalPages || 1,
                }));
            }
        } catch (error) {
            console.error('Failed to fetch collections:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id: string) => {
        const collection = collections.find((c) => c.id === id);
        if (collection) {
            setEditingCollection(collection);
            setShowForm(true);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this collection?')) return;

        try {
            const response = await fetch(`/api/admin/collections/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setCollections(collections.filter((c) => c.id !== id));
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to delete collection');
            }
        } catch (error) {
            console.error('Error deleting collection:', error);
            alert('Failed to delete collection');
        }
    };

    const handleToggleStatus = async (id: string) => {
        const collection = collections.find((c) => c.id === id);
        if (!collection) return;

        try {
            const response = await fetch(`/api/admin/collections/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !collection.isActive }),
            });

            if (response.ok) {
                setCollections(
                    collections.map((c) =>
                        c.id === id ? { ...c, isActive: !c.isActive } : c
                    )
                );
            }
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const handleToggleFeatured = async (id: string) => {
        const collection = collections.find((c) => c.id === id);
        if (!collection) return;

        try {
            const response = await fetch(`/api/admin/collections/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isFeatured: !collection.isFeatured }),
            });

            if (response.ok) {
                setCollections(
                    collections.map((c) =>
                        c.id === id ? { ...c, isFeatured: !c.isFeatured } : c
                    )
                );
            }
        } catch (error) {
            console.error('Error toggling featured:', error);
        }
    };

    const handleFormSubmit = async (data: any) => {
        setLoading(true);

        try {
            const url = editingCollection
                ? `/api/admin/collections/${editingCollection.id}`
                : '/api/admin/collections';
            const method = editingCollection ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                await fetchCollections();
                setShowForm(false);
                setEditingCollection(undefined);
            } else {
                const result = await response.json();
                alert(result.error || 'Failed to save collection');
            }
        } catch (error) {
            console.error('Error saving collection:', error);
            alert('Failed to save collection');
        } finally {
            setLoading(false);
        }
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingCollection(undefined);
    };

    return (
        <AdminLayout locale={locale}>
            <div className="space-y-6">
                {showForm ? (
                    <CollectionForm
                        collection={editingCollection}
                        onSubmit={handleFormSubmit}
                        onCancel={handleFormCancel}
                        loading={loading}
                    />
                ) : (
                    <>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Collections</h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Manage curated property collections for the homepage slider
                                </p>
                            </div>
                            <button
                                onClick={() => setShowForm(true)}
                                className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                            >
                                <Plus size={20} className="mr-2" />
                                Add Collection
                            </button>
                        </div>

                        <CollectionList
                            collections={collections}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onToggleStatus={handleToggleStatus}
                            onToggleFeatured={handleToggleFeatured}
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
