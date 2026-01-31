import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { PropertyGrid } from '@/components/features/properties/PropertyGrid';
import { getNeighborhoodBySlug } from '@/services/neighborhoods';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function NeighborhoodDetailPage({ params }: Props) {
  const { slug } = await params;
  const t = await getTranslations('Neighborhoods.detail');
  const neighborhood = await getNeighborhoodBySlug(slug);

  if (!neighborhood) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${neighborhood.image})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-serif text-5xl md:text-7xl text-white font-light">
            {neighborhood.name}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="font-serif text-3xl text-primary mb-6">
                {t('about', { name: neighborhood.name })}
              </h2>
              <div className="prose prose-lg text-text-secondary whitespace-pre-line">
                {neighborhood.description}
              </div>
            </div>

            {neighborhood.highlights.length > 0 && (
              <div className="lg:col-span-1">
                <h3 className="font-serif text-xl text-primary mb-6">
                  {t('highlights')}
                </h3>
                <div className="space-y-6">
                  {neighborhood.highlights.map((item: any, index: number) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="p-3 bg-background-alt rounded-full text-accent-gold">
                        {item.icon && <span>{item.icon}</span>}
                      </div>
                      <div>
                        <h4 className="font-medium text-primary">{item.title}</h4>
                        <p className="text-sm text-text-secondary">{item.description || item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Properties */}
        {neighborhood.properties.length > 0 && (
          <div className="mb-12">
            <h2 className="font-serif text-3xl text-primary mb-8 text-center">
              {t('properties', { name: neighborhood.name })}
            </h2>
            <PropertyGrid properties={neighborhood.properties} />
          </div>
        )}
      </div>
    </div>
  );
}
