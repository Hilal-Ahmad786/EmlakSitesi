import { use } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { AnalyticsDashboard } from '@/components/admin/analytics/AnalyticsDashboard';

export default function AnalyticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  return (
    <AdminLayout locale={locale}>
      <AnalyticsDashboard locale={locale} />
    </AdminLayout>
  );
}
