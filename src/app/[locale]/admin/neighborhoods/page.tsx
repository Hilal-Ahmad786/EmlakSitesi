'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { NeighborhoodList, NeighborhoodForm, Neighborhood } from '@/components/admin/neighborhoods/NeighborhoodComponents';
import { adminApi } from '@/lib/admin/api';
import { Plus } from 'lucide-react';

export default function NeighborhoodsPage(props: { params: Promise<{ locale: string }> }) {
    const params = use(props.params);
    const { locale } = params;
    const router = useRouter();
    const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingNeighborhood, setEditingNeighborhood] = useState<Neighborhood | undefined>();
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
    });

    useEffect(() => {
        fetchNeighborhoods();
    }, [pagination.page]);

    const fetchNeighborhoods = async () => {
        setLoading(true);
        try {
            const data = await adminApi.neighborhoods.getAll();
            const mapped: Neighborhood[] = (Array.isArray(data) ? data : []).map((n: any) => ({
                id: n.id,
                name: typeof n.name === 'object' ? (n.name?.en || n.name?.tr || '') : String(n.name || ''),
                slug: n.slug || '',
                description: typeof n.description === 'object' ? (n.description?.en || n.description?.tr || '') : String(n.description || ''),
                shortDescription: typeof n.shortDescription === 'object' ? (n.shortDescription?.en || n.shortDescription?.tr || '') : String(n.shortDescription || ''),
                image: n.image || '',
                gallery: Array.isArray(n.images) ? n.images : [],
                location: { lat: n.latitude || 0, lng: n.longitude || 0 },
                stats: {
                    avgPrice: 0,
                    priceChange: 0,
                    totalProperties: n.propertyCount || n._count?.properties || 0,
                    walkabilityScore: 0,
                },
                highlights: Array.isArray(n.highlights) ? n.highlights : [],
                amenities: [],
                status: n.isActive ? 'active' : 'inactive',
                featured: n.isFeatured || false,
                createdAt: n.createdAt || '',
                updatedAt: n.updatedAt || '',
            }));
            setNeighborhoods(mapped);
            setPagination((prev) => ({ ...prev, totalPages: 1 }));
        } catch (err) {
            console.error('Failed to fetch neighborhoods:', err);
            setNeighborhoods([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id: string) => {
        const neighborhood = neighborhoods.find((n) => n.id === id);
        if (neighborhood) {
            setEditingNeighborhood(neighborhood);
            setShowForm(true);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this neighborhood?')) return;
        try {
            await adminApi.neighborhoods.delete(id);
            fetchNeighborhoods();
        } catch (err) {
            console.error('Failed to delete neighborhood:', err);
        }
    };

    const handleToggleStatus = async (id: string) => {
        const neighborhood = neighborhoods.find((n) => n.id === id);
        if (!neighborhood) return;
        try {
            await adminApi.neighborhoods.update(id, {
                isActive: neighborhood.status !== 'active',
            } as any);
            fetchNeighborhoods();
        } catch (err) {
            console.error('Failed to toggle status:', err);
        }
    };

    const handleToggleFeatured = async (id: string) => {
        const neighborhood = neighborhoods.find((n) => n.id === id);
        if (!neighborhood) return;
        try {
            await adminApi.neighborhoods.update(id, {
                isFeatured: !neighborhood.featured,
            } as any);
            fetchNeighborhoods();
        } catch (err) {
            console.error('Failed to toggle featured:', err);
        }
    };

    const handleFormSubmit = async (data: any) => {
        setLoading(true);
        try {
            const payload: any = {
                name: { en: data.name, tr: data.name },
                slug: data.slug,
                description: { en: data.description, tr: data.description },
                shortDescription: { en: data.shortDescription, tr: data.shortDescription },
                image: data.image,
                latitude: data.lat,
                longitude: data.lng,
                highlights: data.highlights,
                isActive: data.status === 'active',
                isFeatured: data.featured,
            };

            if (editingNeighborhood) {
                await adminApi.neighborhoods.update(editingNeighborhood.id, payload);
            } else {
                await adminApi.neighborhoods.create(payload);
            }

            setShowForm(false);
            setEditingNeighborhood(undefined);
            fetchNeighborhoods();
        } catch (err) {
            console.error('Failed to save neighborhood:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingNeighborhood(undefined);
    };

    return (
        <AdminLayout locale={locale}>
            <div className="space-y-6">
                {showForm ? (
                    <NeighborhoodForm
                        neighborhood={editingNeighborhood}
                        onSubmit={handleFormSubmit}
                        onCancel={handleFormCancel}
                        loading={loading}
                    />
                ) : (
                    <>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Neighborhoods</h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Manage neighborhood listings and guides
                                </p>
                            </div>
                            <button
                                onClick={() => setShowForm(true)}
                                className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                            >
                                <Plus size={20} className="mr-2" />
                                Add Neighborhood
                            </button>
                        </div>

                        <NeighborhoodList
                            neighborhoods={neighborhoods}
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
