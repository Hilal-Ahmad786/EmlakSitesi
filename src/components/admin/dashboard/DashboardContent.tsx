'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn, formatCurrency, formatRelativeTime, statusColors, priorityColors } from '@/lib/admin/utils';
import { Card, CardHeader, CardTitle, Badge, Button } from '@/components/admin/common';
import { dashboardApi } from '@/lib/admin/api';
import {
  Building2,
  Users,
  MessageSquare,
  Eye,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowRight,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Loader2,
} from 'lucide-react';

// Stats Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  href?: string;
}

function StatCard({ title, value, change, icon, href }: StatCardProps) {
  const content = (
    <Card className="relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change !== undefined && (
            <div className={cn(
              'flex items-center gap-1 mt-2 text-sm font-medium',
              change >= 0 ? 'text-green-600' : 'text-red-600'
            )}>
              {change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{Math.abs(change)}% from last month</span>
            </div>
          )}
        </div>
        <div className={cn(
          'p-3 rounded-xl',
          'bg-primary/10 text-primary'
        )}>
          {icon}
        </div>
      </div>
      {href && (
        <ArrowUpRight className="absolute top-4 right-4 w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

// Recent Activity Item
interface ActivityItemProps {
  action: string;
  entity: string;
  entityName: string;
  user: string;
  time: string;
}

function ActivityItem({ action, entity, entityName, user, time }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">
          <span className="font-medium">{user}</span>{' '}
          <span className="text-gray-500">{action}</span>{' '}
          <span className="font-medium">{entity}</span>:{' '}
          <span className="truncate">{entityName}</span>
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{time}</p>
      </div>
    </div>
  );
}

// Lead Row Component
interface LeadRowProps {
  name: string;
  email: string;
  property?: string;
  status: string;
  priority: string;
  createdAt: string;
}

function LeadRow({ name, email, property, status, priority, createdAt }: LeadRowProps) {
  const statusColor = statusColors[status] || statusColors.NEW;
  const priorityColor = priorityColors[priority] || priorityColors.MEDIUM;

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{name}</p>
        <p className="text-xs text-gray-500 truncate">{email}</p>
        {property && (
          <p className="text-xs text-gray-400 truncate mt-0.5">
            Property: {property}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Badge className={cn(statusColor.bg, statusColor.text)} size="sm">
          {status.replace('_', ' ')}
        </Badge>
        <Badge className={cn(priorityColor.bg, priorityColor.text)} size="sm">
          {priority}
        </Badge>
      </div>
    </div>
  );
}

// Property Row Component
interface PropertyRowProps {
  title: string;
  location: string;
  price: number;
  views: number;
  inquiries: number;
  status: string;
}

function PropertyRow({ title, location, price, views, inquiries, status }: PropertyRowProps) {
  const statusColor = statusColors[status] || statusColors.DRAFT;

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <MapPin size={12} />
            {location}
          </span>
          <span className="text-xs font-medium text-accent-gold">
            {formatCurrency(price)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <Eye size={14} />
          {views}
        </span>
        <span className="flex items-center gap-1">
          <MessageSquare size={14} />
          {inquiries}
        </span>
        <Badge className={cn(statusColor.bg, statusColor.text)} size="sm">
          {status}
        </Badge>
      </div>
    </div>
  );
}

// Helper to get localized string from JSON
function getLoc(json: any): string {
  if (!json) return '';
  if (typeof json === 'string') return json;
  return json.en || json.tr || '';
}

// Main Dashboard Component
export function DashboardContent({ locale }: { locale: string }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeProperties: 0,
    totalLeads: 0,
    recentLeads: 0,
    totalViews: 0,
  });
  const [recentActivities, setRecentActivities] = useState<ActivityItemProps[]>([]);
  const [recentLeads, setRecentLeads] = useState<LeadRowProps[]>([]);
  const [topProperties, setTopProperties] = useState<PropertyRowProps[]>([]);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const data = await dashboardApi.getStats();
        const d = data as any;

        setStats({
          totalProperties: d.totalProperties || 0,
          activeProperties: d.activeProperties || 0,
          totalLeads: d.totalLeads || 0,
          recentLeads: d.recentLeads || 0,
          totalViews: d.totalViews || 0,
        });

        if (d.recentActivities) {
          setRecentActivities(d.recentActivities.map((a: any) => ({
            action: a.action?.toLowerCase() || '',
            entity: a.entityType || '',
            entityName: typeof a.details === 'object' ? (a.details?.title || a.details?.name || a.entityId || '') : (a.details || ''),
            user: a.user?.name || 'System',
            time: formatRelativeTime(a.createdAt),
          })));
        }

        if (d.recentLeadsList) {
          setRecentLeads(d.recentLeadsList.map((l: any) => ({
            name: l.name,
            email: l.email,
            property: l.property ? getLoc(l.property.title) : undefined,
            status: l.status,
            priority: l.priority,
            createdAt: l.createdAt,
          })));
        }

        if (d.topProperties) {
          setTopProperties(d.topProperties.map((p: any) => ({
            title: getLoc(p.title),
            location: p.neighborhood || p.city || '',
            price: p.price,
            views: p.viewCount || 0,
            inquiries: p.inquiryCount || 0,
            status: p.status,
          })));
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here&apos;s what&apos;s happening with your properties.</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/${locale}/admin/properties/new`}>
            <Button icon={<Building2 size={18} />}>
              Add Property
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Properties"
          value={stats.totalProperties}
          icon={<Building2 size={24} />}
          href={`/${locale}/admin/properties`}
        />
        <StatCard
          title="Published"
          value={stats.activeProperties}
          icon={<Eye size={24} />}
          href={`/${locale}/admin/properties?status=PUBLISHED`}
        />
        <StatCard
          title="Total Leads"
          value={stats.totalLeads}
          icon={<MessageSquare size={24} />}
          href={`/${locale}/admin/leads`}
        />
        <StatCard
          title="New Leads (7d)"
          value={stats.recentLeads}
          icon={<Users size={24} />}
          href={`/${locale}/admin/leads?status=NEW`}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Leads</CardTitle>
            <Link href={`/${locale}/admin/leads`}>
              <Button variant="ghost" size="sm">
                View All <ArrowRight size={16} className="ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <div>
            {recentLeads.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">No leads yet</p>
            ) : (
              recentLeads.map((lead, index) => (
                <LeadRow key={index} {...lead} />
              ))
            )}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <div>
            {recentActivities.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">No activity yet</p>
            ) : (
              recentActivities.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Top Properties */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Top Performing Properties</CardTitle>
          <Link href={`/${locale}/admin/properties`}>
            <Button variant="ghost" size="sm">
              View All <ArrowRight size={16} className="ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <div>
          {topProperties.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No properties yet</p>
          ) : (
            topProperties.map((property, index) => (
              <PropertyRow key={index} {...property} />
            ))
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Building2 size={24} />
            </div>
            <div>
              <h3 className="font-semibold">Add New Property</h3>
              <p className="text-sm text-white/70 mt-0.5">Create a new property listing</p>
            </div>
          </div>
          <Link href={`/${locale}/admin/properties/new`}>
            <Button variant="secondary" size="sm" className="mt-4 w-full">
              Get Started
            </Button>
          </Link>
        </Card>

        <Card className="bg-accent-gold text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <MessageSquare size={24} />
            </div>
            <div>
              <h3 className="font-semibold">Manage Leads</h3>
              <p className="text-sm text-white/70 mt-0.5">{stats.recentLeads} new inquiries</p>
            </div>
          </div>
          <Link href={`/${locale}/admin/leads`}>
            <Button variant="secondary" size="sm" className="mt-4 w-full">
              View Leads
            </Button>
          </Link>
        </Card>

        <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 className="font-semibold">SEO Overview</h3>
              <p className="text-sm text-white/70 mt-0.5">Optimize your listings</p>
            </div>
          </div>
          <Link href={`/${locale}/admin/seo`}>
            <Button variant="secondary" size="sm" className="mt-4 w-full">
              View SEO
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
