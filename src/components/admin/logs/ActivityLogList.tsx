'use client';

import { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  LogIn,
  LogOut,
  Settings,
  Download,
  Filter,
  Calendar,
  User,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityLog {
  id: string;
  action: 'create' | 'update' | 'delete' | 'view' | 'login' | 'logout' | 'settings';
  entity: 'property' | 'lead' | 'user' | 'settings' | 'session';
  entityId?: string;
  entityTitle?: string;
  description: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

const mockLogs: ActivityLog[] = [
  {
    id: '1',
    action: 'create',
    entity: 'property',
    entityId: 'prop-123',
    entityTitle: 'Luxury Bosphorus Villa',
    description: 'Created new property listing',
    user: { id: '1', name: 'John Doe', email: 'john@example.com' },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    timestamp: '2024-01-15T14:30:00Z',
  },
  {
    id: '2',
    action: 'update',
    entity: 'property',
    entityId: 'prop-456',
    entityTitle: 'Galata Apartment',
    description: 'Updated price from €350,000 to €375,000',
    user: { id: '1', name: 'John Doe', email: 'john@example.com' },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    timestamp: '2024-01-15T13:45:00Z',
    metadata: { oldPrice: 350000, newPrice: 375000 },
  },
  {
    id: '3',
    action: 'delete',
    entity: 'lead',
    entityId: 'lead-789',
    entityTitle: 'Mike Wilson',
    description: 'Deleted lead record',
    user: { id: '2', name: 'Sarah Smith', email: 'sarah@example.com' },
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    timestamp: '2024-01-15T12:00:00Z',
  },
  {
    id: '4',
    action: 'login',
    entity: 'session',
    description: 'User logged in',
    user: { id: '1', name: 'John Doe', email: 'john@example.com' },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    timestamp: '2024-01-15T09:00:00Z',
  },
  {
    id: '5',
    action: 'settings',
    entity: 'settings',
    description: 'Updated email notification settings',
    user: { id: '2', name: 'Sarah Smith', email: 'sarah@example.com' },
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    timestamp: '2024-01-14T16:30:00Z',
  },
];

const actionIcons = {
  create: Plus,
  update: Edit,
  delete: Trash2,
  view: Eye,
  login: LogIn,
  logout: LogOut,
  settings: Settings,
};

const actionColors = {
  create: 'bg-green-100 text-green-600',
  update: 'bg-blue-100 text-blue-600',
  delete: 'bg-red-100 text-red-600',
  view: 'bg-gray-100 text-gray-600',
  login: 'bg-purple-100 text-purple-600',
  logout: 'bg-orange-100 text-orange-600',
  settings: 'bg-yellow-100 text-yellow-600',
};

const entityLabels = {
  property: 'Property',
  lead: 'Lead',
  user: 'User',
  settings: 'Settings',
  session: 'Session',
};

function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface ActivityLogListProps {
  logs?: ActivityLog[];
}

export function ActivityLogList({ logs = mockLogs }: ActivityLogListProps) {
  const [filter, setFilter] = useState<{
    action: string;
    entity: string;
    user: string;
    dateFrom: string;
    dateTo: string;
  }>({
    action: '',
    entity: '',
    user: '',
    dateFrom: '',
    dateTo: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredLogs = logs.filter((log) => {
    if (filter.action && log.action !== filter.action) return false;
    if (filter.entity && log.entity !== filter.entity) return false;
    if (filter.user && !log.user.name.toLowerCase().includes(filter.user.toLowerCase())) return false;
    if (filter.dateFrom && new Date(log.timestamp) < new Date(filter.dateFrom)) return false;
    if (filter.dateTo && new Date(log.timestamp) > new Date(filter.dateTo)) return false;
    return true;
  });

  const handleExport = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Entity', 'Description', 'IP Address'],
      ...filteredLogs.map((log) => [
        log.timestamp,
        log.user.name,
        log.action,
        log.entity,
        log.description,
        log.ipAddress,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Activity Logs</h2>
          <p className="text-sm text-gray-500">Track all actions performed in the admin panel</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
              showFilters ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            <Filter size={18} />
            Filters
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
            <select
              value={filter.action}
              onChange={(e) => setFilter({ ...filter, action: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="view">View</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
              <option value="settings">Settings</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Entity</label>
            <select
              value={filter.entity}
              onChange={(e) => setFilter({ ...filter, entity: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All entities</option>
              <option value="property">Property</option>
              <option value="lead">Lead</option>
              <option value="user">User</option>
              <option value="settings">Settings</option>
              <option value="session">Session</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
            <input
              type="text"
              value={filter.user}
              onChange={(e) => setFilter({ ...filter, user: e.target.value })}
              placeholder="Search by name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={filter.dateFrom}
              onChange={(e) => setFilter({ ...filter, dateFrom: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={filter.dateTo}
              onChange={(e) => setFilter({ ...filter, dateTo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Logs List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredLogs.map((log) => {
            const Icon = actionIcons[log.action];
            const colorClass = actionColors[log.action];

            return (
              <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Action Icon */}
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', colorClass)}>
                    <Icon size={20} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-gray-900">{log.description}</p>
                        {log.entityTitle && (
                          <p className="text-sm text-primary mt-0.5">
                            {log.entityTitle}
                            {log.entityId && (
                              <button className="ml-2 text-gray-400 hover:text-primary">
                                <ExternalLink size={12} />
                              </button>
                            )}
                          </p>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        {formatDate(log.timestamp)}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {log.user.name}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                        {entityLabels[log.entity]}
                      </span>
                      <span className="text-gray-400">{log.ipAddress}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredLogs.length === 0 && (
            <div className="p-8 text-center">
              <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No activity logs found</p>
              <p className="text-sm text-gray-400">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination placeholder */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {filteredLogs.length} of {logs.length} entries
        </p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors" disabled>
            Previous
          </button>
          <span className="px-3 py-1 text-sm bg-primary text-white rounded">1</span>
          <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
