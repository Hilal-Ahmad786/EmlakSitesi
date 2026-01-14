'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { NeighborhoodList, NeighborhoodForm, Neighborhood } from '@/components/admin/neighborhoods/NeighborhoodComponents';
import { Plus } from 'lucide-react';

// Mock data for neighborhoods
const mockNeighborhoods: Neighborhood[] = [
    {
        id: '1',
        name: 'Bebek',
        slug: 'bebek',
        description: 'Bebek is one of Istanbul\'s most affluent and picturesque neighborhoods, located on the European shores of the Bosphorus.',
        shortDescription: 'Prestigious waterfront neighborhood on the Bosphorus',
        image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800',
        gallery: [],
        location: { lat: 41.0766, lng: 29.0433 },
        stats: {
            avgPrice: 15000000,
            priceChange: 12.5,
            totalProperties: 24,
            walkabilityScore: 85,
        },
        highlights: ['Waterfront promenade', 'Fine dining', 'Historic mansions', 'International schools'],
        amenities: ['Restaurants', 'Cafes', 'Parks', 'Schools', 'Public Transport'],
        status: 'active',
        featured: true,
        createdAt: '2024-01-15',
        updatedAt: '2024-12-01',
    },
    {
        id: '2',
        name: 'Nişantaşı',
        slug: 'nisantasi',
        description: 'Nişantaşı is an upscale neighborhood known for its luxury boutiques, trendy cafes, and historic architecture.',
        shortDescription: 'Upscale shopping district with luxury boutiques',
        image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800',
        gallery: [],
        location: { lat: 41.0522, lng: 28.9922 },
        stats: {
            avgPrice: 8500000,
            priceChange: 8.2,
            totalProperties: 18,
            walkabilityScore: 92,
        },
        highlights: ['Luxury shopping', 'Art galleries', 'Trendy cafes', 'Central location'],
        amenities: ['Shopping Malls', 'Restaurants', 'Gyms', 'Banks', 'Public Transport'],
        status: 'active',
        featured: true,
        createdAt: '2024-01-20',
        updatedAt: '2024-11-15',
    },
    {
        id: '3',
        name: 'Sarıyer',
        slug: 'sariyer',
        description: 'Sarıyer offers a perfect blend of nature and luxury living, with beautiful forests and exclusive waterfront villas.',
        shortDescription: 'Nature retreat with exclusive waterfront properties',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        gallery: [],
        location: { lat: 41.1667, lng: 29.0500 },
        stats: {
            avgPrice: 12000000,
            priceChange: 15.3,
            totalProperties: 32,
            walkabilityScore: 65,
        },
        highlights: ['Forest views', 'Waterfront villas', 'Belgrade Forest', 'Exclusive estates'],
        amenities: ['Parks', 'Hospitals', 'Schools', 'Supermarkets'],
        status: 'active',
        featured: false,
        createdAt: '2024-02-01',
        updatedAt: '2024-10-20',
    },
    {
        id: '4',
        name: 'Arnavutköy',
        slug: 'arnavutkoy',
        description: 'Arnavutköy is a historic fishing village turned exclusive residential area, famous for its colorful wooden houses.',
        shortDescription: 'Historic village with charming wooden houses',
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        gallery: [],
        location: { lat: 41.0681, lng: 29.0431 },
        stats: {
            avgPrice: 9500000,
            priceChange: 10.1,
            totalProperties: 15,
            walkabilityScore: 78,
        },
        highlights: ['Historic architecture', 'Seafood restaurants', 'Bosphorus views', 'Quiet atmosphere'],
        amenities: ['Restaurants', 'Cafes', 'Parks', 'Public Transport'],
        status: 'active',
        featured: false,
        createdAt: '2024-02-15',
        updatedAt: '2024-09-30',
    },
];

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
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        setNeighborhoods(mockNeighborhoods);
        setPagination((prev) => ({ ...prev, totalPages: 1 }));
        setLoading(false);
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
        setNeighborhoods(neighborhoods.filter((n) => n.id !== id));
    };

    const handleToggleStatus = async (id: string) => {
        setNeighborhoods(
            neighborhoods.map((n) =>
                n.id === id
                    ? { ...n, status: n.status === 'active' ? 'inactive' : 'active' }
                    : n
            )
        );
    };

    const handleToggleFeatured = async (id: string) => {
        setNeighborhoods(
            neighborhoods.map((n) =>
                n.id === id ? { ...n, featured: !n.featured } : n
            )
        );
    };

    const handleFormSubmit = async (data: any) => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (editingNeighborhood) {
            setNeighborhoods(
                neighborhoods.map((n) =>
                    n.id === editingNeighborhood.id
                        ? {
                            ...n,
                            ...data,
                            location: { lat: data.lat, lng: data.lng },
                            stats: { ...n.stats, avgPrice: data.avgPrice, walkabilityScore: data.walkabilityScore },
                            updatedAt: new Date().toISOString(),
                        }
                        : n
                )
            );
        } else {
            const newNeighborhood: Neighborhood = {
                id: String(Date.now()),
                ...data,
                gallery: [],
                location: { lat: data.lat, lng: data.lng },
                stats: {
                    avgPrice: data.avgPrice,
                    priceChange: 0,
                    totalProperties: 0,
                    walkabilityScore: data.walkabilityScore,
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setNeighborhoods([newNeighborhood, ...neighborhoods]);
        }

        setShowForm(false);
        setEditingNeighborhood(undefined);
        setLoading(false);
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
