'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { FilterSidebar } from '@/components/features/properties/FilterSidebar';
import { PropertyGrid } from '@/components/features/properties/PropertyGrid';
import { Button } from '@/components/ui/Button';
import { LayoutGrid, Map as MapIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/features/properties/MapView'), {
    ssr: false,
    loading: () => <div className="h-[600px] w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">Loading Map...</div>
});

interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface PropertyContentProps {
    initialProperties: any[];
    pagination?: PaginationInfo;
    filters?: { type?: string; location?: string };
}

export function PropertyContent({ initialProperties, pagination, filters }: PropertyContentProps) {
    const t = useTranslations('Search.filters');
    const tCommon = useTranslations('Common');
    const router = useRouter();
    const searchParams = useSearchParams();
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
    const [isPending, startTransition] = useTransition();

    const currentPage = pagination?.page || 1;
    const totalPages = pagination?.totalPages || 1;
    const total = pagination?.total || 0;

    const navigateToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (page > 1) {
            params.set('page', String(page));
        } else {
            params.delete('page');
        }
        startTransition(() => {
            router.push(`?${params.toString()}`);
        });
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | '...')[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
                <FilterSidebar />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
                {/* Header with count and view toggle */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-gray-500">
                        {total > 0 ? `${total} properties found` : ''}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant={viewMode === 'grid' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setViewMode('grid')}
                            className="flex items-center gap-2"
                        >
                            <LayoutGrid size={16} />
                            {t('view.grid')}
                        </Button>
                        <Button
                            variant={viewMode === 'map' ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setViewMode('map')}
                            className="flex items-center gap-2"
                        >
                            <MapIcon size={16} />
                            {t('view.map')}
                        </Button>
                    </div>
                </div>

                {isPending && (
                    <div className="flex justify-center py-8">
                        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                <div className={isPending ? 'opacity-50 pointer-events-none' : ''}>
                    {viewMode === 'grid' ? (
                        <PropertyGrid properties={initialProperties} />
                    ) : (
                        <MapView properties={initialProperties} />
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <nav className="flex items-center justify-center gap-2 mt-12 mb-4">
                        <button
                            onClick={() => navigateToPage(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={16} />
                            {tCommon('previous')}
                        </button>

                        <div className="flex items-center gap-1">
                            {getPageNumbers().map((pageNum, idx) =>
                                pageNum === '...' ? (
                                    <span key={`dots-${idx}`} className="px-2 py-2 text-gray-400">
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        key={pageNum}
                                        onClick={() => navigateToPage(pageNum as number)}
                                        className={`min-w-[40px] h-10 rounded-lg text-sm font-medium transition-colors ${pageNum === currentPage
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'border border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                )
                            )}
                        </div>

                        <button
                            onClick={() => navigateToPage(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                            className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            {tCommon('next')}
                            <ChevronRight size={16} />
                        </button>
                    </nav>
                )}
            </div>
        </div>
    );
}
