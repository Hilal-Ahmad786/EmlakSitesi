import { use } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { EmailTemplateList } from '@/components/admin/email/EmailTemplateEditor';

export default function EmailTemplatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  return (
    <AdminLayout locale={locale}>
      <EmailTemplateList />
    </AdminLayout>
  );
}
