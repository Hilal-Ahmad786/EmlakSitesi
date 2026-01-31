import { HeroSlider } from '@/components/features/home/HeroSlider';
import { FeaturedCollections } from '@/components/features/home/FeaturedCollections';
import { LatestProperties } from '@/components/features/home/LatestProperties';
import { PropertyOfTheWeek } from '@/components/features/home/PropertyOfTheWeek';
import { PromoMosaic } from '@/components/features/home/PromoMosaic';
import { ReferenceShowcase } from '@/components/features/home/ReferenceShowcase';
import { Metadata } from 'next';
import { getProperties } from '@/services/properties';
import { getCollections } from '@/services/collections';

export const metadata: Metadata = {
  title: "Maison d'Orient | Luxury Real Estate in Istanbul",
  description: "Discover exclusive luxury properties in Istanbul's most prestigious neighborhoods. Your trusted partner for premium real estate investment in Turkey.",
};

export default async function HomePage() {
  // Fetch data in parallel
  const [
    latestPropertiesRes,
    featuredPropertiesRes,
    collections
  ] = await Promise.all([
    getProperties({ limit: 6, status: 'PUBLISHED' }),
    getProperties({ limit: 1, featured: true, status: 'PUBLISHED' }),
    getCollections()
  ]);

  const latestProperties = latestPropertiesRes.data;
  // Use the first featured property, or fall back to the most expensive/newest one from latest if none marked featured
  let featuredProperty = featuredPropertiesRes.data[0];

  // If no explicitly featured property, try to pick one from latest or just undefined
  if (!featuredProperty && latestProperties.length > 0) {
    featuredProperty = latestProperties[0];
  }

  // Transform for PropertyOfTheWeek specific needs (adding images array if needed, etc)
  const formattedFeaturedProperty = featuredProperty ? {
    ...featuredProperty,
    images: Array.isArray(featuredProperty.image) ? featuredProperty.image : [featuredProperty.image], // Ensure array
    // Add other missing fields if necessary, or ensure getProperties returns them
    description: 'Discover this exclusive property in the heart of Istanbul.', // Fallback description if service doesn't return full desc
    currency: 'EUR' // Assumption
  } : null;

  return (
    <div className="min-h-screen pb-20">
      <HeroSlider />
      <FeaturedCollections collections={collections} />
      <LatestProperties properties={latestProperties} />
      <PropertyOfTheWeek property={formattedFeaturedProperty as any} />
      {/* Type assertion used because PropertyOfTheWeek expects a specific shape that might slightly differ from Property grid */}
      <PromoMosaic />
      <ReferenceShowcase />
    </div>
  );
}
