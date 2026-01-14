import { use } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { ActivityLogList } from '@/components/admin/logs/ActivityLogList';

export default function ActivityLogsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  return (
    <AdminLayout locale={locale}>
      <ActivityLogList />
    </AdminLayout>
  );
}
