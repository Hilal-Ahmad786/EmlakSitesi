import { DashboardContent } from '@/components/admin/dashboard/DashboardContent';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Admin Panel',
  description: 'Admin dashboard overview',
};

interface DashboardPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;

  return (
    <AdminLayout locale={locale}>
      <DashboardContent locale={locale} />
    </AdminLayout>
  );
}
