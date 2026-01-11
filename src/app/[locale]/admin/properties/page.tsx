'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { PropertyList } from '@/components/admin/properties/PropertyComponents';
import { adminApi } from '@/lib/admin/api';
import type { Property } from '@/types/admin';

interface PropertiesPageProps {
  params: Promise<{ locale: string }>;
}

export default function PropertiesPage(props: PropertiesPageProps) {
  const params = use(props.params);
  const { locale } = params;
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
  });

  useEffect(() => {
    fetchProperties();
  }, [pagination.page]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await adminApi.properties.list({
        page: pagination.page,
        limit: 10,
      });
      setProperties(response.data);
      setPagination(prev => ({
        ...prev,
        totalPages: response.pagination?.totalPages || 1,
      }));
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/${locale}/admin/properties/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    try {
      await adminApi.properties.delete(id);
      fetchProperties();
    } catch (error) {
      console.error('Failed to delete property:', error);
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      const property = properties.find(p => p.id === id);
      if (property) {
        await adminApi.properties.update(id, {
          isFeatured: !property.isFeatured,
        });
        fetchProperties();
      }
    } catch (error) {
      console.error('Failed to update property:', error);
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      const property = properties.find(p => p.id === id);
      if (property) {
        await adminApi.properties.update(id, {
          status: property.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED',
        });
        fetchProperties();
      }
    } catch (error) {
      console.error('Failed to update property:', error);
    }
  };

  return (
    <AdminLayout locale={locale}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your property listings
          </p>
        </div>

        <PropertyList
          properties={properties}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleFeatured={handleToggleFeatured}
          onTogglePublish={handleTogglePublish}
          loading={loading}
          pagination={{
            ...pagination,
            onPageChange: (page) => setPagination(prev => ({ ...prev, page })),
          }}
          locale={locale}
        />
      </div>
    </AdminLayout>
  );
}
