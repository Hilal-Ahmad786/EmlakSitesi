import { HeroSlider } from '@/components/features/home/HeroSlider';
import { SearchBar } from '@/components/features/home/SearchBar';
import { FeaturedCollections } from '@/components/features/home/FeaturedCollections';
import { LatestProperties } from '@/components/features/home/LatestProperties';
import { NeighborhoodSpotlight } from '@/components/features/home/NeighborhoodSpotlight';
import { PropertyOfTheWeek } from '@/components/features/home/PropertyOfTheWeek';
import { ReviewsList } from '@/components/features/reviews/ReviewsList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Maison d'Orient | Luxury Real Estate in Istanbul",
  description: "Discover exclusive luxury properties in Istanbul's most prestigious neighborhoods. Your trusted partner for premium real estate investment in Turkey.",
};

// Mock reviews data for homepage testimonials
const testimonialReviews = [
  {
    id: '1',
    author: { name: 'Alexander Thompson', location: 'United Kingdom' },
    rating: 5,
    title: 'Exceptional Service and Expertise',
    content: 'The team at Maison d\'Orient made our dream of owning a Bosphorus property a reality. Their knowledge of the luxury market and attention to detail exceeded all expectations.',
    date: '2024-12-15',
    helpful: 24,
    verified: true,
  },
  {
    id: '2',
    author: { name: 'Sophie Laurent', location: 'France' },
    rating: 5,
    title: 'Professional and Trustworthy',
    content: 'From the first viewing to closing, the experience was seamless. They found us the perfect waterfront villa in Bebek. Highly recommend for anyone seeking premium properties in Istanbul.',
    date: '2024-11-28',
    helpful: 18,
    verified: true,
  },
  {
    id: '3',
    author: { name: 'Michael Weber', location: 'Germany' },
    rating: 4,
    title: 'Great Investment Guidance',
    content: 'Excellent market insights and investment advice. They helped us understand the Turkish real estate market and secure a property with great appreciation potential.',
    date: '2024-10-22',
    helpful: 15,
    verified: true,
  },
  {
    id: '4',
    author: { name: 'Elena Petrova', location: 'Russia' },
    rating: 5,
    title: 'Luxury Experience from Start to Finish',
    content: 'The team\'s expertise in historic Ottoman properties is unmatched. They guided us through every step of purchasing our Yalı mansion with professionalism and care.',
    date: '2024-09-18',
    helpful: 21,
    verified: true,
  },
  {
    id: '5',
    author: { name: 'James Chen', location: 'Singapore' },
    rating: 5,
    title: 'Outstanding Attention to Detail',
    content: 'As an overseas buyer, I was concerned about the process. The Maison d\'Orient team made everything transparent and easy. Our penthouse in Nişantaşı is perfect.',
    date: '2024-08-10',
    helpful: 12,
    verified: true,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen pb-20">
      <HeroSlider />
      <SearchBar />
      <PropertyOfTheWeek />
      <FeaturedCollections />
      <LatestProperties />
      <NeighborhoodSpotlight />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-primary mb-4">
            What Our Clients Say
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Trusted by discerning buyers from around the world
          </p>
        </div>
        <ReviewsList reviews={testimonialReviews} showFilters={false} />
      </div>
    </div>
  );
}
