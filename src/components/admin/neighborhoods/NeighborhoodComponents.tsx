'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    MapPin,
    Search,
    Plus,
    Edit2,
    Trash2,
    Eye,
    EyeOff,
    Image as ImageIcon,
    ChevronLeft,
    ChevronRight,
    Save,
    ArrowLeft,
    Home,
    TrendingUp,
    Users,
    Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
export interface Neighborhood {
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    image: string;
    gallery: string[];
    location: {
        lat: number;
        lng: number;
    };
    stats: {
        avgPrice: number;
        priceChange: number;
        totalProperties: number;
        walkabilityScore: number;
    };
    highlights: string[];
    amenities: string[];
    status: 'active' | 'inactive';
    featured: boolean;
    createdAt: string;
    updatedAt: string;
}

interface NeighborhoodListProps {
    neighborhoods: Neighborhood[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onToggleStatus: (id: string) => void;
    onToggleFeatured: (id: string) => void;
    loading?: boolean;
    pagination: {
        page: number;
        totalPages: number;
        onPageChange: (page: number) => void;
    };
}

interface NeighborhoodFormProps {
    neighborhood?: Neighborhood;
    onSubmit: (data: NeighborhoodFormData) => void;
    onCancel: () => void;
    loading?: boolean;
}

interface NeighborhoodFormData {
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    image: string;
    lat: number;
    lng: number;
    avgPrice: number;
    walkabilityScore: number;
    highlights: string[];
    amenities: string[];
    status: 'active' | 'inactive';
    featured: boolean;
}

// Amenity Options
const amenityOptions = [
    'Schools',
    'Hospitals',
    'Parks',
    'Restaurants',
    'Shopping Malls',
    'Public Transport',
    'Gyms',
    'Cafes',
    'Banks',
    'Supermarkets',
];

// Neighborhood List Component
export function NeighborhoodList({
    neighborhoods,
    onEdit,
    onDelete,
    onToggleStatus,
    onToggleFeatured,
    loading,
    pagination,
}: NeighborhoodListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filteredNeighborhoods = neighborhoods.filter((neighborhood) => {
        const matchesSearch = neighborhood.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter === 'all' || neighborhood.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const formatPrice = (price: number) => {
        if (price >= 1000000) {
            return `€${(price / 1000000).toFixed(1)}M`;
        }
        return `€${(price / 1000).toFixed(0)}K`;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-3 text-gray-500">Loading neighborhoods...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Search neighborhoods..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNeighborhoods.length === 0 ? (
                    <div className="col-span-full bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">No neighborhoods found</p>
                    </div>
                ) : (
                    filteredNeighborhoods.map((neighborhood) => (
                        <div
                            key={neighborhood.id}
                            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            {/* Image */}
                            <div className="relative h-48">
                                {neighborhood.image ? (
                                    <img
                                        src={neighborhood.image}
                                        alt={neighborhood.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                        <ImageIcon className="h-12 w-12 text-gray-400" />
                                    </div>
                                )}
                                {neighborhood.featured && (
                                    <span className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded">
                                        Featured
                                    </span>
                                )}
                                <span
                                    className={cn(
                                        'absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded',
                                        neighborhood.status === 'active'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-500 text-white'
                                    )}
                                >
                                    {neighborhood.status}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    {neighborhood.name}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                    {neighborhood.shortDescription}
                                </p>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <Home className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">
                                            {neighborhood.stats.totalProperties} properties
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <TrendingUp
                                            className={cn(
                                                'h-4 w-4',
                                                neighborhood.stats.priceChange >= 0
                                                    ? 'text-green-500'
                                                    : 'text-red-500'
                                            )}
                                        />
                                        <span className="text-sm text-gray-600">
                                            {neighborhood.stats.priceChange >= 0 ? '+' : ''}
                                            {neighborhood.stats.priceChange}%
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-900">
                                            {formatPrice(neighborhood.stats.avgPrice)}
                                        </span>
                                        <span className="text-xs text-gray-500">avg.</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Star className="h-4 w-4 text-yellow-500" />
                                        <span className="text-sm text-gray-600">
                                            {neighborhood.stats.walkabilityScore}/100
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onToggleStatus(neighborhood.id)}
                                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                                            title={neighborhood.status === 'active' ? 'Deactivate' : 'Activate'}
                                        >
                                            {neighborhood.status === 'active' ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => onToggleFeatured(neighborhood.id)}
                                            className={cn(
                                                'p-2 rounded-lg hover:bg-gray-100',
                                                neighborhood.featured
                                                    ? 'text-yellow-500'
                                                    : 'text-gray-400 hover:text-gray-600'
                                            )}
                                            title={neighborhood.featured ? 'Remove from featured' : 'Add to featured'}
                                        >
                                            <Star size={18} />
                                        </button>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onEdit(neighborhood.id)}
                                            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100"
                                            title="Edit"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(neighborhood.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="bg-white rounded-lg border border-gray-200 px-6 py-4 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Page {pagination.page} of {pagination.totalPages}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => pagination.onPageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={() => pagination.onPageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.totalPages}
                            className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Neighborhood Form Component
export function NeighborhoodForm({
    neighborhood,
    onSubmit,
    onCancel,
    loading,
}: NeighborhoodFormProps) {
    const [highlights, setHighlights] = useState<string[]>(neighborhood?.highlights || []);
    const [highlightInput, setHighlightInput] = useState('');
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
        neighborhood?.amenities || []
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<NeighborhoodFormData>({
        defaultValues: {
            name: neighborhood?.name || '',
            slug: neighborhood?.slug || '',
            description: neighborhood?.description || '',
            shortDescription: neighborhood?.shortDescription || '',
            image: neighborhood?.image || '',
            lat: neighborhood?.location.lat || 41.0082,
            lng: neighborhood?.location.lng || 28.9784,
            avgPrice: neighborhood?.stats.avgPrice || 0,
            walkabilityScore: neighborhood?.stats.walkabilityScore || 75,
            status: neighborhood?.status || 'active',
            featured: neighborhood?.featured || false,
        },
    });

    const handleAddHighlight = () => {
        if (highlightInput.trim() && !highlights.includes(highlightInput.trim())) {
            setHighlights([...highlights, highlightInput.trim()]);
            setHighlightInput('');
        }
    };

    const handleRemoveHighlight = (highlight: string) => {
        setHighlights(highlights.filter((h) => h !== highlight));
    };

    const toggleAmenity = (amenity: string) => {
        if (selectedAmenities.includes(amenity)) {
            setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
        } else {
            setSelectedAmenities([...selectedAmenities, amenity]);
        }
    };

    const onFormSubmit = (data: NeighborhoodFormData) => {
        onSubmit({ ...data, highlights, amenities: selectedAmenities });
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Neighborhoods
                </button>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                    >
                        <Save size={18} className="mr-2" />
                        {loading ? 'Saving...' : neighborhood ? 'Update' : 'Create'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                        <h3 className="font-medium text-gray-900">Basic Information</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name *
                                </label>
                                <input
                                    {...register('name', { required: 'Name is required' })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="e.g., Bebek"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Slug *
                                </label>
                                <input
                                    {...register('slug', { required: 'Slug is required' })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="bebek"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Short Description
                            </label>
                            <input
                                {...register('shortDescription')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Brief one-line description"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Description
                            </label>
                            <textarea
                                {...register('description')}
                                rows={6}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Detailed description of the neighborhood"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Featured Image URL
                            </label>
                            <input
                                {...register('image')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                        <h3 className="font-medium text-gray-900">Location</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Latitude
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    {...register('lat', { valueAsNumber: true })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Longitude
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    {...register('lng', { valueAsNumber: true })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Highlights */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                        <h3 className="font-medium text-gray-900">Highlights</h3>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={highlightInput}
                                onChange={(e) => setHighlightInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddHighlight();
                                    }
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Add a highlight"
                            />
                            <button
                                type="button"
                                onClick={handleAddHighlight}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {highlights.map((highlight) => (
                                <span
                                    key={highlight}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                                >
                                    {highlight}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveHighlight(highlight)}
                                        className="ml-2 text-primary/60 hover:text-primary"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                        <h3 className="font-medium text-gray-900">Status</h3>
                        <div>
                            <select
                                {...register('status')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...register('featured')}
                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <span className="text-sm text-gray-700">Featured Neighborhood</span>
                        </label>
                    </div>

                    {/* Stats */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                        <h3 className="font-medium text-gray-900">Statistics</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Average Price (€)
                            </label>
                            <input
                                type="number"
                                {...register('avgPrice', { valueAsNumber: true })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Walkability Score (0-100)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                {...register('walkabilityScore', { valueAsNumber: true })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                        <h3 className="font-medium text-gray-900">Amenities</h3>
                        <div className="space-y-2">
                            {amenityOptions.map((amenity) => (
                                <label key={amenity} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedAmenities.includes(amenity)}
                                        onChange={() => toggleAmenity(amenity)}
                                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                    />
                                    <span className="text-sm text-gray-700">{amenity}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
