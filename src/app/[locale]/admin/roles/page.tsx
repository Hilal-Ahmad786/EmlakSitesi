import { use } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { RoleManager } from '@/components/admin/roles/RoleManager';

export default function RolesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  return (
    <AdminLayout locale={locale}>
      <RoleManager />
    </AdminLayout>
  );
}
