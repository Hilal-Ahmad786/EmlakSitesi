'use client';

import { useState } from 'react';
import { cn } from '@/lib/admin/utils';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Input,
  Textarea,
  Select,
  Switch,
  Tabs,
  Badge,
  Modal,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/admin/common';
import {
  Search,
  Globe,
  FileText,
  Link2,
  Settings,
  Save,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Copy,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Code,
} from 'lucide-react';

// ============================================================================
// SEO FORM COMPONENT (Reusable for Global/Page/Entity SEO)
// ============================================================================

interface SeoFormData {
  metaTitle: { en: string; tr: string };
  metaDescription: { en: string; tr: string };
  keywords: { en: string[]; tr: string[] };
  ogTitle?: { en: string; tr: string };
  ogDescription?: { en: string; tr: string };
  ogImage?: string;
  canonicalUrl?: string;
  robots?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  schemaMarkup?: string;
}

interface SeoFormProps {
  data: SeoFormData;
  onChange: (data: SeoFormData) => void;
  showOpenGraph?: boolean;
  showTwitter?: boolean;
  showSchema?: boolean;
  showRobots?: boolean;
}

export function SeoForm({
  data,
  onChange,
  showOpenGraph = true,
  showTwitter = false,
  showSchema = true,
  showRobots = true,
}: SeoFormProps) {
  const [activeLocale, setActiveLocale] = useState<'en' | 'tr'>('en');
  const [keywordInput, setKeywordInput] = useState('');

  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const updateLocalizedField = (field: keyof SeoFormData, locale: 'en' | 'tr', value: string) => {
    const current = data[field] as { en: string; tr: string } || { en: '', tr: '' };
    onChange({
      ...data,
      [field]: { ...current, [locale]: value },
    });
  };

  const addKeyword = () => {
    if (!keywordInput.trim()) return;
    const current = data.keywords || { en: [], tr: [] };
    const updated = {
      ...current,
      [activeLocale]: [...(current[activeLocale] || []), keywordInput.trim()],
    };
    onChange({ ...data, keywords: updated });
    setKeywordInput('');
  };

  const removeKeyword = (index: number) => {
    const current = data.keywords || { en: [], tr: [] };
    const updated = {
      ...current,
      [activeLocale]: current[activeLocale].filter((_, i) => i !== index),
    };
    onChange({ ...data, keywords: updated });
  };

  // Character counters
  const titleLength = (data.metaTitle?.[activeLocale] || '').length;
  const descLength = (data.metaDescription?.[activeLocale] || '').length;

  return (
    <div className="space-y-6">
      {/* Language Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveLocale('en')}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-t-lg transition-colors',
            activeLocale === 'en'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          🇬🇧 English
        </button>
        <button
          onClick={() => setActiveLocale('tr')}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-t-lg transition-colors',
            activeLocale === 'tr'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          🇹🇷 Türkçe
        </button>
      </div>

      {/* Meta Title */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium text-gray-700">
            Meta Title
          </label>
          <span className={cn(
            'text-xs',
            titleLength > 60 ? 'text-red-500' : titleLength > 50 ? 'text-yellow-500' : 'text-gray-400'
          )}>
            {titleLength}/60
          </span>
        </div>
        <Input
          value={data.metaTitle?.[activeLocale] || ''}
          onChange={(e) => updateLocalizedField('metaTitle', activeLocale, e.target.value)}
          placeholder="Enter page title for search engines"
          hint="Recommended: 50-60 characters"
        />
      </div>

      {/* Meta Description */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium text-gray-700">
            Meta Description
          </label>
          <span className={cn(
            'text-xs',
            descLength > 160 ? 'text-red-500' : descLength > 140 ? 'text-yellow-500' : 'text-gray-400'
          )}>
            {descLength}/160
          </span>
        </div>
        <Textarea
          value={data.metaDescription?.[activeLocale] || ''}
          onChange={(e) => updateLocalizedField('metaDescription', activeLocale, e.target.value)}
          placeholder="Enter page description for search engines"
          hint="Recommended: 140-160 characters"
          rows={3}
        />
      </div>

      {/* Keywords */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Keywords
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            placeholder="Add keyword"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
          />
          <Button variant="outline" onClick={addKeyword}>
            <Plus size={18} />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(data.keywords?.[activeLocale] || []).map((keyword, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
            >
              {keyword}
              <button
                onClick={() => removeKeyword(index)}
                className="hover:text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Canonical URL */}
      <Input
        label="Canonical URL"
        value={data.canonicalUrl || ''}
        onChange={(e) => updateField('canonicalUrl', e.target.value)}
        placeholder="https://maison-dorient.com/..."
        hint="Leave empty to use current page URL"
      />

      {/* Open Graph Section */}
      {showOpenGraph && (
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe size={18} />
              Open Graph (Social Media)
            </CardTitle>
            <CardDescription>
              How your page appears when shared on Facebook, LinkedIn, etc.
            </CardDescription>
          </CardHeader>
          <div className="space-y-4">
            <Input
              label="OG Title"
              value={data.ogTitle?.[activeLocale] || ''}
              onChange={(e) => updateLocalizedField('ogTitle', activeLocale, e.target.value)}
              placeholder="Leave empty to use meta title"
            />
            <Textarea
              label="OG Description"
              value={data.ogDescription?.[activeLocale] || ''}
              onChange={(e) => updateLocalizedField('ogDescription', activeLocale, e.target.value)}
              placeholder="Leave empty to use meta description"
              rows={2}
            />
            <Input
              label="OG Image URL"
              value={data.ogImage || ''}
              onChange={(e) => updateField('ogImage', e.target.value)}
              placeholder="https://..."
              hint="Recommended size: 1200x630px"
            />
          </div>
        </Card>
      )}

      {/* Robots & Indexing */}
      {showRobots && (
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings size={18} />
              Indexing Options
            </CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">No Index</p>
                <p className="text-xs text-gray-500">Prevent search engines from indexing this page</p>
              </div>
              <Switch
                checked={data.noIndex || false}
                onChange={(e) => updateField('noIndex', e.target.checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">No Follow</p>
                <p className="text-xs text-gray-500">Prevent search engines from following links</p>
              </div>
              <Switch
                checked={data.noFollow || false}
                onChange={(e) => updateField('noFollow', e.target.checked)}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Schema Markup */}
      {showSchema && (
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Code size={18} />
              Schema Markup (JSON-LD)
            </CardTitle>
            <CardDescription>
              Structured data for rich search results
            </CardDescription>
          </CardHeader>
          <Textarea
            value={data.schemaMarkup || ''}
            onChange={(e) => updateField('schemaMarkup', e.target.value)}
            placeholder='{"@context": "https://schema.org", ...}'
            rows={6}
            className="font-mono text-xs"
          />
        </Card>
      )}

      {/* SEO Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Eye size={18} />
            Search Result Preview
          </CardTitle>
        </CardHeader>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-blue-600 text-lg hover:underline cursor-pointer">
            {data.metaTitle?.[activeLocale] || 'Page Title'}
          </p>
          <p className="text-green-700 text-sm">
            https://maison-dorient.com/...
          </p>
          <p className="text-gray-600 text-sm mt-1">
            {data.metaDescription?.[activeLocale] || 'Page description will appear here...'}
          </p>
        </div>
      </Card>
    </div>
  );
}

// ============================================================================
// GLOBAL SEO SETTINGS COMPONENT
// ============================================================================

interface GlobalSeoPage {
  id: string;
  page: string;
  label: string;
  metaTitle: { en: string; tr: string };
  metaDescription: { en: string; tr: string };
  lastUpdated: string;
}

export function GlobalSeoSettings({ locale }: { locale: string }) {
  const [activeTab, setActiveTab] = useState('pages');
  const [selectedPage, setSelectedPage] = useState<GlobalSeoPage | null>(null);
  const [saving, setSaving] = useState(false);

  const pages: GlobalSeoPage[] = [
    {
      id: '1',
      page: 'home',
      label: 'Homepage',
      metaTitle: { en: "Maison d'Orient | Luxury Real Estate Istanbul", tr: "Maison d'Orient | İstanbul Lüks Gayrimenkul" },
      metaDescription: { en: 'Discover exclusive luxury properties...', tr: 'Özel lüks mülkleri keşfedin...' },
      lastUpdated: '2024-01-10',
    },
    {
      id: '2',
      page: 'properties',
      label: 'Properties Page',
      metaTitle: { en: 'Luxury Properties | Maison d\'Orient', tr: 'Lüks Gayrimenkuller | Maison d\'Orient' },
      metaDescription: { en: 'Browse our curated collection...', tr: 'Seçkin koleksiyonumuzu inceleyin...' },
      lastUpdated: '2024-01-08',
    },
    {
      id: '3',
      page: 'neighborhoods',
      label: 'Neighborhoods Page',
      metaTitle: { en: 'Istanbul Neighborhoods | Maison d\'Orient', tr: 'İstanbul Mahalleler | Maison d\'Orient' },
      metaDescription: { en: 'Explore Istanbul\'s finest neighborhoods...', tr: 'İstanbul\'un en iyi mahallelerini keşfedin...' },
      lastUpdated: '2024-01-05',
    },
    {
      id: '4',
      page: 'services',
      label: 'Services Page',
      metaTitle: { en: 'Our Services | Maison d\'Orient', tr: 'Hizmetlerimiz | Maison d\'Orient' },
      metaDescription: { en: 'Comprehensive real estate services...', tr: 'Kapsamlı gayrimenkul hizmetleri...' },
      lastUpdated: '2024-01-03',
    },
    {
      id: '5',
      page: 'contact',
      label: 'Contact Page',
      metaTitle: { en: 'Contact Us | Maison d\'Orient', tr: 'İletişim | Maison d\'Orient' },
      metaDescription: { en: 'Get in touch with our expert team...', tr: 'Uzman ekibimizle iletişime geçin...' },
      lastUpdated: '2024-01-01',
    },
    {
      id: '6',
      page: 'blog',
      label: 'Blog Page',
      metaTitle: { en: 'Market Insights | Maison d\'Orient', tr: 'Piyasa Analizleri | Maison d\'Orient' },
      metaDescription: { en: 'Latest news and analysis from Istanbul real estate...', tr: 'İstanbul gayrimenkul haberler ve analizler...' },
      lastUpdated: '2024-01-02',
    },
  ];

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
  };

  const tabs = [
    { id: 'pages', label: 'Page SEO', count: pages.length },
    { id: 'defaults', label: 'Default Settings' },
    { id: 'analytics', label: 'Analytics Codes' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Global SEO Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage SEO settings for all pages on your website
          </p>
        </div>
        <Button onClick={handleSave} loading={saving} icon={<Save size={18} />}>
          Save Changes
        </Button>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Content */}
      {activeTab === 'pages' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pages List */}
          <Card className="lg:col-span-1" padding="none">
            <div className="p-4 border-b border-gray-100">
              <Input
                placeholder="Search pages..."
                icon={<Search size={18} />}
              />
            </div>
            <div className="divide-y divide-gray-100">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => setSelectedPage(page)}
                  className={cn(
                    'w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors',
                    selectedPage?.id === page.id && 'bg-primary/5 border-l-4 border-primary'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{page.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">/{page.page}</p>
                    </div>
                    <Badge variant="success" size="sm">Active</Badge>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* SEO Form */}
          <Card className="lg:col-span-2">
            {selectedPage ? (
              <>
                <CardHeader>
                  <CardTitle>{selectedPage.label} SEO</CardTitle>
                  <CardDescription>
                    Last updated: {selectedPage.lastUpdated}
                  </CardDescription>
                </CardHeader>
                <SeoForm
                  data={{
                    metaTitle: selectedPage.metaTitle,
                    metaDescription: selectedPage.metaDescription,
                    keywords: { en: [], tr: [] },
                  }}
                  onChange={() => {}}
                />
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <div className="text-center">
                  <FileText size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Select a page to edit its SEO settings</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'defaults' && (
        <Card>
          <CardHeader>
            <CardTitle>Default SEO Settings</CardTitle>
            <CardDescription>
              These settings will be used as fallbacks when page-specific SEO is not defined
            </CardDescription>
          </CardHeader>
          <div className="space-y-6">
            <Input
              label="Site Name"
              defaultValue="Maison d'Orient"
              hint="Used in title templates: {Page Title} | {Site Name}"
            />
            <Input
              label="Title Separator"
              defaultValue="|"
              hint="Character between page title and site name"
            />
            <Input
              label="Default OG Image"
              placeholder="https://..."
              hint="Used when no specific OG image is set"
            />
            <Textarea
              label="Organization Schema"
              placeholder='{"@type": "RealEstateAgent", ...}'
              hint="JSON-LD for organization/business information"
              rows={4}
              className="font-mono text-xs"
            />
          </div>
        </Card>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Google Analytics</CardTitle>
              <CardDescription>Track website traffic and user behavior</CardDescription>
            </CardHeader>
            <div className="space-y-4">
              <Input
                label="Google Analytics 4 Measurement ID"
                placeholder="G-XXXXXXXXXX"
              />
              <Switch label="Enable Analytics" defaultChecked />
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Google Tag Manager</CardTitle>
              <CardDescription>Manage all your tags in one place</CardDescription>
            </CardHeader>
            <Input
              label="GTM Container ID"
              placeholder="GTM-XXXXXXX"
            />
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Facebook Pixel</CardTitle>
              <CardDescription>Track conversions from Facebook ads</CardDescription>
            </CardHeader>
            <Input
              label="Pixel ID"
              placeholder="XXXXXXXXXXXXXXXXX"
            />
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Google Search Console</CardTitle>
              <CardDescription>Verify ownership for search console</CardDescription>
            </CardHeader>
            <Input
              label="Verification Meta Tag Content"
              placeholder="Verification code from Search Console"
            />
          </Card>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// REDIRECTS MANAGEMENT COMPONENT
// ============================================================================

interface Redirect {
  id: string;
  source: string;
  destination: string;
  type: 301 | 302;
  isActive: boolean;
  hits: number;
  createdAt: string;
}

export function RedirectsManager({ locale }: { locale: string }) {
  const [redirects, setRedirects] = useState<Redirect[]>([
    { id: '1', source: '/old-page', destination: '/new-page', type: 301, isActive: true, hits: 245, createdAt: '2024-01-05' },
    { id: '2', source: '/properties/old-slug', destination: '/properties/new-slug', type: 301, isActive: true, hits: 89, createdAt: '2024-01-08' },
    { id: '3', source: '/temporary-promo', destination: '/special-offers', type: 302, isActive: false, hits: 12, createdAt: '2024-01-10' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingRedirect, setEditingRedirect] = useState<Redirect | null>(null);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this redirect?')) {
      setRedirects(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleToggle = (id: string) => {
    setRedirects(prev => prev.map(r =>
      r.id === id ? { ...r, isActive: !r.isActive } : r
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">URL Redirects</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage 301 and 302 redirects for your website
          </p>
        </div>
        <Button onClick={() => { setEditingRedirect(null); setShowModal(true); }} icon={<Plus size={18} />}>
          Add Redirect
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Redirects</p>
              <p className="text-xl font-bold text-gray-900">
                {redirects.filter(r => r.isActive).length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Link2 className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Hits</p>
              <p className="text-xl font-bold text-gray-900">
                {redirects.reduce((sum, r) => sum + r.hits, 0)}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Inactive</p>
              <p className="text-xl font-bold text-gray-900">
                {redirects.filter(r => !r.isActive).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Hits</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {redirects.map((redirect) => (
              <TableRow key={redirect.id}>
                <TableCell className="font-mono text-sm">{redirect.source}</TableCell>
                <TableCell className="font-mono text-sm">{redirect.destination}</TableCell>
                <TableCell>
                  <Badge variant={redirect.type === 301 ? 'success' : 'info'}>
                    {redirect.type}
                  </Badge>
                </TableCell>
                <TableCell>{redirect.hits}</TableCell>
                <TableCell>
                  <Switch
                    checked={redirect.isActive}
                    onChange={() => handleToggle(redirect.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setEditingRedirect(redirect); setShowModal(true); }}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(redirect.id)}
                      className="p-1 hover:bg-red-100 rounded text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingRedirect ? 'Edit Redirect' : 'Add Redirect'}
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Source URL"
            placeholder="/old-page"
            defaultValue={editingRedirect?.source}
            hint="The URL path to redirect from (without domain)"
          />
          <Input
            label="Destination URL"
            placeholder="/new-page or https://..."
            defaultValue={editingRedirect?.destination}
            hint="The URL to redirect to"
          />
          <Select
            label="Redirect Type"
            options={[
              { value: '301', label: '301 - Permanent' },
              { value: '302', label: '302 - Temporary' },
            ]}
            defaultValue={String(editingRedirect?.type || 301)}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowModal(false)}>
              {editingRedirect ? 'Update' : 'Create'} Redirect
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================================
// SITEMAP CONFIGURATION COMPONENT
// ============================================================================

export function SitemapSettings({ locale }: { locale: string }) {
  const [regenerating, setRegenerate] = useState(false);

  const sitemapEntities = [
    { type: 'properties', label: 'Properties', count: 48, changefreq: 'weekly', priority: 0.8, enabled: true },
    { type: 'neighborhoods', label: 'Neighborhoods', count: 12, changefreq: 'monthly', priority: 0.7, enabled: true },
    { type: 'blog', label: 'Blog Posts', count: 24, changefreq: 'weekly', priority: 0.6, enabled: true },
    { type: 'pages', label: 'Static Pages', count: 8, changefreq: 'monthly', priority: 0.5, enabled: true },
  ];

  const handleRegenerate = async () => {
    setRegenerate(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRegenerate(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sitemap Configuration</h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure how your sitemap.xml is generated
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={<ExternalLink size={18} />}>
            View Sitemap
          </Button>
          <Button onClick={handleRegenerate} loading={regenerating} icon={<RefreshCw size={18} />}>
            Regenerate
          </Button>
        </div>
      </div>

      {/* Sitemap URL */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Sitemap URL</p>
            <p className="text-sm text-gray-500 font-mono mt-1">
              https://maison-dorient.com/sitemap.xml
            </p>
          </div>
          <Button variant="outline" size="sm" icon={<Copy size={16} />}>
            Copy
          </Button>
        </div>
      </Card>

      {/* Entity Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Included Content</CardTitle>
          <CardDescription>
            Configure which content types are included in your sitemap
          </CardDescription>
        </CardHeader>
        <div className="space-y-4">
          {sitemapEntities.map((entity) => (
            <div
              key={entity.type}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center gap-4">
                <Switch defaultChecked={entity.enabled} />
                <div>
                  <p className="font-medium text-gray-900">{entity.label}</p>
                  <p className="text-sm text-gray-500">{entity.count} URLs</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Select
                  options={[
                    { value: 'always', label: 'Always' },
                    { value: 'hourly', label: 'Hourly' },
                    { value: 'daily', label: 'Daily' },
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'monthly', label: 'Monthly' },
                    { value: 'yearly', label: 'Yearly' },
                  ]}
                  defaultValue={entity.changefreq}
                  className="w-32"
                />
                <Select
                  options={[
                    { value: '1.0', label: '1.0' },
                    { value: '0.9', label: '0.9' },
                    { value: '0.8', label: '0.8' },
                    { value: '0.7', label: '0.7' },
                    { value: '0.6', label: '0.6' },
                    { value: '0.5', label: '0.5' },
                  ]}
                  defaultValue={String(entity.priority)}
                  className="w-24"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Robots.txt Quick Link */}
      <Card className="bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Robots.txt Configuration</p>
            <p className="text-sm text-gray-500 mt-1">
              Configure which pages search engines can access
            </p>
          </div>
          <Button variant="outline">
            Edit Robots.txt
          </Button>
        </div>
      </Card>
    </div>
  );
}
