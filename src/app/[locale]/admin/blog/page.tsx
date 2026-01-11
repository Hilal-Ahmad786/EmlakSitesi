'use client';

import { use } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';

export default function BlogPage(props: { params: Promise<{ locale: string }> }) {
    const params = use(props.params);
    return (
        <AdminLayout locale={params.locale}>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Blog</h1>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
                    This module is missing from the source files.
                </div>
            </div>
        </AdminLayout>
    );
}
