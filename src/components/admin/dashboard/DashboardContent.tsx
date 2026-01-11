'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn, formatCurrency, formatRelativeTime, statusColors, priorityColors } from '@/lib/admin/utils';
import { Card, CardHeader, CardTitle, Badge, Button } from '@/components/admin/common';
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

// Main Dashboard Component
export function DashboardContent({ locale }: { locale: string }) {
  const [stats, setStats] = useState({
    totalProperties: 48,
    publishedProperties: 42,
    totalLeads: 156,
    newLeads: 12,
    totalViews: 8543,
    monthlyViews: 1234,
  });

  const recentActivities = [
    { action: 'created', entity: 'Property', entityName: 'Historic Yalı in Bebek', user: 'Ahmet Y.', time: '5 minutes ago' },
    { action: 'updated', entity: 'Lead', entityName: 'John Smith', user: 'Elif D.', time: '15 minutes ago' },
    { action: 'published', entity: 'Blog Post', entityName: 'Market Outlook 2024', user: 'Admin', time: '1 hour ago' },
    { action: 'assigned', entity: 'Lead', entityName: 'Sarah Johnson', user: 'Mehmet K.', time: '2 hours ago' },
    { action: 'uploaded', entity: 'Images', entityName: 'Penthouse Gallery', user: 'Ayşe Ç.', time: '3 hours ago' },
  ];

  const recentLeads = [
    { name: 'Michael Chen', email: 'michael@email.com', property: 'Bosphorus View Villa', status: 'NEW', priority: 'HIGH', createdAt: '2024-01-10' },
    { name: 'Elena Petrova', email: 'elena@email.com', property: 'Galata Penthouse', status: 'CONTACTED', priority: 'MEDIUM', createdAt: '2024-01-09' },
    { name: 'James Wilson', email: 'james@email.com', status: 'QUALIFIED', priority: 'HIGH', createdAt: '2024-01-08' },
    { name: 'Sophia Laurent', email: 'sophia@email.com', property: 'Nişantaşı Apartment', status: 'VIEWING_SCHEDULED', priority: 'MEDIUM', createdAt: '2024-01-07' },
  ];

  const topProperties = [
    { title: 'Historic Yalı Mansion', location: 'Bebek', price: 12500000, views: 1234, inquiries: 23, status: 'PUBLISHED' },
    { title: 'Luxury Penthouse', location: 'Galata', price: 2850000, views: 892, inquiries: 18, status: 'PUBLISHED' },
    { title: 'Modern Villa', location: 'Sarıyer', price: 4500000, views: 756, inquiries: 12, status: 'PUBLISHED' },
    { title: 'Historic Apartment', location: 'Cihangir', price: 850000, views: 643, inquiries: 9, status: 'PUBLISHED' },
  ];

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
          change={8}
          icon={<Building2 size={24} />}
          href={`/${locale}/admin/properties`}
        />
        <StatCard
          title="Published"
          value={stats.publishedProperties}
          change={5}
          icon={<Eye size={24} />}
          href={`/${locale}/admin/properties?status=PUBLISHED`}
        />
        <StatCard
          title="Total Leads"
          value={stats.totalLeads}
          change={12}
          icon={<MessageSquare size={24} />}
          href={`/${locale}/admin/leads`}
        />
        <StatCard
          title="New Leads"
          value={stats.newLeads}
          change={-3}
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
            {recentLeads.map((lead, index) => (
              <LeadRow key={index} {...lead} />
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <div>
            {recentActivities.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
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
          {topProperties.map((property, index) => (
            <PropertyRow key={index} {...property} />
          ))}
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
              <p className="text-sm text-white/70 mt-0.5">{stats.newLeads} new inquiries</p>
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
