'use client';

import { useState } from 'react';
import {
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Star,
    StarOff,
    GripVertical,
    Link as LinkIcon,
    Image as ImageIcon,
    X,
} from 'lucide-react';

export interface Collection {
    id: string;
    title: { en: string; tr: string };
    slug: string;
    description?: { en?: string; tr?: string };
    image?: string | null;
    link: string;
    propertyCount: number;
    isActive: boolean;
    isFeatured: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
}

interface CollectionListProps {
    collections: Collection[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onToggleStatus: (id: string) => void;
    onToggleFeatured: (id: string) => void;
    onReorder?: (collections: Collection[]) => void;
    loading: boolean;
    pagination: {
        page: number;
        totalPages: number;
        onPageChange: (page: number) => void;
    };
}

export function CollectionList({
    collections,
    onEdit,
    onDelete,
    onToggleStatus,
    onToggleFeatured,
    loading,
    pagination,
}: CollectionListProps) {
    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-border p-8">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    <span className="ml-3 text-gray-500">Loading collections...</span>
                </div>
            </div>
        );
    }

    if (collections.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-border p-12 text-center">
                <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Collections Yet</h3>
                <p className="text-gray-500">
                    Create your first collection to showcase curated properties.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                                Order
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Collection
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Link
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Properties
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Featured
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {collections.map((collection) => (
                            <tr key={collection.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center text-gray-400 cursor-grab">
                                        <GripVertical size={16} />
                                        <span className="ml-2 text-sm">{collection.order}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-12 w-16 rounded overflow-hidden bg-gray-100">
                                            {collection.image ? (
                                                <img
                                                    src={collection.image}
                                                    alt={collection.title.en}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center">
                                                    <ImageIcon size={20} className="text-gray-300" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {collection.title.en}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {collection.title.tr}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <LinkIcon size={14} className="mr-1" />
                                        <span className="truncate max-w-[200px]">{collection.link}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {collection.propertyCount}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => onToggleStatus(collection.id)}
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                                            collection.isActive
                                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                        }`}
                                    >
                                        {collection.isActive ? (
                                            <>
                                                <Eye size={12} className="mr-1" /> Active
                                            </>
                                        ) : (
                                            <>
                                                <EyeOff size={12} className="mr-1" /> Hidden
                                            </>
                                        )}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => onToggleFeatured(collection.id)}
                                        className={`p-1 rounded transition-colors ${
                                            collection.isFeatured
                                                ? 'text-yellow-500 hover:text-yellow-600'
                                                : 'text-gray-300 hover:text-gray-400'
                                        }`}
                                    >
                                        {collection.isFeatured ? <Star size={20} fill="currentColor" /> : <StarOff size={20} />}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(collection.id)}
                                            className="p-2 text-gray-400 hover:text-primary transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(collection.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => pagination.onPageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-500">
                            Page {pagination.page} of {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => pagination.onPageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.totalPages}
                            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

interface CollectionFormProps {
    collection?: Collection;
    onSubmit: (data: any) => void;
    onCancel: () => void;
    loading: boolean;
}

export function CollectionForm({ collection, onSubmit, onCancel, loading }: CollectionFormProps) {
    const [formData, setFormData] = useState({
        titleEn: collection?.title.en || '',
        titleTr: collection?.title.tr || '',
        descriptionEn: collection?.description?.en || '',
        descriptionTr: collection?.description?.tr || '',
        image: collection?.image || '',
        link: collection?.link || '/properties',
        propertyCount: collection?.propertyCount || 0,
        isActive: collection?.isActive ?? true,
        isFeatured: collection?.isFeatured ?? false,
        order: collection?.order || 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            title: { en: formData.titleEn, tr: formData.titleTr },
            description: { en: formData.descriptionEn, tr: formData.descriptionTr },
            image: formData.image || null,
            link: formData.link,
            propertyCount: formData.propertyCount,
            isActive: formData.isActive,
            isFeatured: formData.isFeatured,
            order: formData.order,
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-border">
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {collection ? 'Edit Collection' : 'Create Collection'}
                    </h2>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Titles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title (English) *
                        </label>
                        <input
                            type="text"
                            value={formData.titleEn}
                            onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title (Turkish) *
                        </label>
                        <input
                            type="text"
                            value={formData.titleTr}
                            onChange={(e) => setFormData({ ...formData, titleTr: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            required
                        />
                    </div>
                </div>

                {/* Descriptions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description (English)
                        </label>
                        <textarea
                            value={formData.descriptionEn}
                            onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description (Turkish)
                        </label>
                        <textarea
                            value={formData.descriptionTr}
                            onChange={(e) => setFormData({ ...formData, descriptionTr: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>
                </div>

                {/* Image URL */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image URL
                    </label>
                    <div className="flex gap-4">
                        <input
                            type="url"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            placeholder="https://example.com/image.jpg"
                        />
                        {formData.image && (
                            <div className="w-16 h-10 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => (e.currentTarget.src = '')}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Link */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Link URL *
                    </label>
                    <input
                        type="text"
                        value={formData.link}
                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="/properties?type=villa"
                        required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        URL path to filter properties (e.g., /properties?type=villa)
                    </p>
                </div>

                {/* Order and Count */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Display Order
                        </label>
                        <input
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Property Count
                        </label>
                        <input
                            type="number"
                            value={formData.propertyCount}
                            onChange={(e) => setFormData({ ...formData, propertyCount: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            min="0"
                        />
                    </div>
                </div>

                {/* Status Toggles */}
                <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">Active (Visible on website)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.isFeatured}
                            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">Featured (Show in homepage slider)</span>
                    </label>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : collection ? 'Update Collection' : 'Create Collection'}
                    </button>
                </div>
            </form>
        </div>
    );
}
