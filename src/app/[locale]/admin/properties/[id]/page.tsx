'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { PropertyForm } from '@/components/admin/properties/PropertyComponents';
import { adminApi } from '@/lib/admin/api';
import { LoadingSpinner } from '@/components/admin/common';
import type { Property, PropertyFormData } from '@/types/admin';

interface PropertyEditPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default function PropertyEditPage(props: PropertyEditPageProps) {
  const params = use(props.params);
  const { locale, id } = params;
  const router = useRouter();
  const isNew = id === 'new';
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const data = await adminApi.properties.get(id);
      setProperty(data);
    } catch (error) {
      console.error('Failed to fetch property:', error);
      router.push(`/${locale}/admin/properties`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: PropertyFormData) => {
    setSaving(true);
    try {
      if (isNew) {
        await adminApi.properties.create(data);
      } else {
        await adminApi.properties.update(id, data);
      }
      router.push(`/${locale}/admin/properties`);
    } catch (error) {
      console.error('Failed to save property:', error);
      alert('Failed to save property. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/${locale}/admin/properties`);
  };

  if (loading) {
    return (
      <AdminLayout locale={locale}>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout locale={locale}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isNew ? 'Add New Property' : 'Edit Property'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isNew
              ? 'Create a new property listing'
              : `Editing: ${property?.title?.en || property?.title?.tr}`}
          </p>
        </div>

        <PropertyForm
          initialData={property ? {
            ...property,
            images: property.images || [],
          } : undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={saving}
          locale={locale}
        />
      </div>
    </AdminLayout>
  );
}
