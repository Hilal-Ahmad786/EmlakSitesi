import { getTranslations } from 'next-intl/server';
import { NeighborhoodCard } from '@/components/features/neighborhoods/NeighborhoodCard';
import { getNeighborhoods } from '@/services/neighborhoods';

export default async function NeighborhoodsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('Neighborhoods');
  const neighborhoods = await getNeighborhoods(locale);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary-dark text-white py-20 mb-12 mt-[120px]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">{t('title')}</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {neighborhoods.length === 0 ? (
          <p className="text-center text-text-secondary py-12">No neighborhoods available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {neighborhoods.map((neighborhood) => (
              <NeighborhoodCard key={neighborhood.id} neighborhood={neighborhood} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
