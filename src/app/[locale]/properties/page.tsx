import { getTranslations } from 'next-intl/server';
import { getProperties } from '@/services/properties';
import { PropertyContent } from '@/components/features/properties/PropertyContent';

export default async function PropertiesPage({
    searchParams,
    params
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params;
    const t = await getTranslations('Search.filters');
    const resolvedParams = await searchParams;

    // Convert search params to service filters
    const type = typeof resolvedParams.type === 'string' ? resolvedParams.type : undefined;
    const location = typeof resolvedParams.location === 'string' ? resolvedParams.location : undefined;
    const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page) || 1 : 1;

    // Fetch initial data
    const { data: properties, pagination } = await getProperties({
        type,
        location,
        status: 'PUBLISHED',
        page,
        limit: 12,
        locale
    });

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="bg-primary-dark text-white py-12 mb-8 mt-[120px]">
                <div className="container mx-auto px-4">
                    <h1 className="font-serif text-3xl md:text-4xl mb-4">Properties</h1>
                    <p className="text-gray-300 max-w-2xl">
                        Discover our curated selection of luxury properties in Istanbul&apos;s most prestigious neighborhoods.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <PropertyContent
                    initialProperties={properties}
                    pagination={pagination}
                    filters={{ type, location }}
                />
            </div>
        </div>
    );
}
