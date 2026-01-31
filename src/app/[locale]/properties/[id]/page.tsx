import { notFound } from 'next/navigation';
import { getPropertyById } from '@/services/properties';
import { PropertyDetailClient } from '@/components/features/properties/PropertyDetailClient';

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  return <PropertyDetailClient property={property} />;
}
