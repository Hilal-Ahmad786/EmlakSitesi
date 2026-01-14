'use client';

import { useState, useEffect, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import {
  GlobalSeoSettings,
  RedirectsManager,
  SitemapSettings,
  RobotsTxtEditor
} from '@/components/admin/seo/SeoComponents';
import { Tabs } from '@/components/admin/common';
interface SeoPageProps {
  params: Promise<{ locale: string }>;
}

export default function SeoPage(props: SeoPageProps) {
  const params = use(props.params);
  const { locale } = params;
  const [activeTab, setActiveTab] = useState('global');

  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  const tabs = [
    { id: 'global', label: 'Global SEO' },
    { id: 'redirects', label: 'Redirects' },
    { id: 'sitemap', label: 'Sitemap' },
    { id: 'robots', label: 'Robots.txt' },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Optional: Update URL without refresh
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tabId);
    window.history.pushState({}, '', url);
  };

  return (
    <AdminLayout locale={locale}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SEO Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure search engine optimization settings for your website
          </p>
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />

        {activeTab === 'global' && (
          <GlobalSeoSettings locale={locale} />
        )}

        {activeTab === 'redirects' && (
          <RedirectsManager locale={locale} />
        )}

        {activeTab === 'sitemap' && (
          <SitemapSettings locale={locale} />
        )}

        {activeTab === 'robots' && (
          <RobotsTxtEditor locale={locale} />
        )}
      </div>
    </AdminLayout>
  );
}
