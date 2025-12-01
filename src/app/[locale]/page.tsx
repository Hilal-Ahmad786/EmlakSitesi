import { useTranslations } from 'next-intl';
import { HeroSlider } from '@/components/features/home/HeroSlider';
import { SearchBar } from '@/components/features/home/SearchBar';
import { FeaturedCollections } from '@/components/features/home/FeaturedCollections';
import { LatestProperties } from '@/components/features/home/LatestProperties';
import { NeighborhoodSpotlight } from '@/components/features/home/NeighborhoodSpotlight';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Maison d'Orient | Luxury Real Estate in Istanbul",
  description: "Discover exclusive luxury properties in Istanbul's most prestigious neighborhoods. Your trusted partner for premium real estate investment in Turkey.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen pb-20">
      <HeroSlider />
      <SearchBar />
      <FeaturedCollections />
      <LatestProperties />
      <NeighborhoodSpotlight />
    </div>
  );
}
