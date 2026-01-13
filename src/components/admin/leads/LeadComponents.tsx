'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Card, CardHeader, CardTitle, CardDescription,
  Button, Input, Badge, Table, TableHeader, TableBody,
  TableRow, TableHead, TableCell, Modal, LoadingSpinner,
  EmptyState, Tabs, Pagination, Select, Textarea
} from '@/components/admin/common';
import { cn, formatDate, formatRelativeTime, statusColors, priorityColors } from '@/lib/admin/utils';
import {
  Search, Filter, Download, MessageSquare, Phone, Mail,
  User, Calendar, Building2, Clock, Send, Plus, Eye,
  ChevronRight, MoreVertical, Edit, Trash2, UserPlus
} from 'lucide-react';
import type { Lead, LeadStatus, LeadPriority, LeadSource } from '@/types/admin';

// Lead Status Badge
export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const colors = statusColors[status] || statusColors.NEW;
  return (
    <Badge className={cn(colors.bg, colors.text)}>
      {status.replace(/_/g, ' ')}
    </Badge>
  );
}

// Lead Priority Badge
export function LeadPriorityBadge({ priority }: { priority: LeadPriority }) {
  const colors = priorityColors[priority] || priorityColors.MEDIUM;
  return (
    <Badge className={cn(colors.bg, colors.text)} size="sm">
      {priority}
    </Badge>
  );
}

// Lead List Component
interface LeadListProps {
  leads: Lead[];
  onView: (id: string) => void;
  onStatusChange: (id: string, status: LeadStatus) => void;
  onAssign: (id: string, userId: string) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
  pagination?: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  locale: string;
}

export function LeadList({
  leads,
  onView,
  onStatusChange,
  onAssign,
  onDelete,
  loading,
  pagination,
  locale
}: LeadListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const statusOptions: { value: string; label: string }[] = [
    { value: 'all', label: 'All Status' },
    { value: 'NEW', label: 'New' },
    { value: 'CONTACTED', label: 'Contacted' },
    { value: 'QUALIFIED', label: 'Qualified' },
    { value: 'VIEWING_SCHEDULED', label: 'Viewing Scheduled' },
    { value: 'NEGOTIATING', label: 'Negotiating' },
    { value: 'CLOSED_WON', label: 'Won' },
    { value: 'CLOSED_LOST', label: 'Lost' },
  ];

  const priorityOptions: { value: string; label: string }[] = [
    { value: 'all', label: 'All Priority' },
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
    { value: 'URGENT', label: 'Urgent' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!leads.length) {
    return (
      <EmptyState
        icon={<MessageSquare size={48} />}
        title="No leads found"
        description="Leads will appear here when customers submit inquiries."
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusOptions}
            className="w-40"
          />
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            options={priorityOptions}
            className="w-36"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" icon={<Download size={18} />}>
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id} className="cursor-pointer hover:bg-gray-50" onClick={() => onView(lead.id)}>
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">{lead.name}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail size={12} /> {lead.email}
                      </span>
                      {lead.phone && (
                        <span className="flex items-center gap-1">
                          <Phone size={12} /> {lead.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {lead.property ? (
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-600 truncate max-w-[150px]">
                        {lead.property.title?.en || lead.property.title?.tr}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">General Inquiry</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">{lead.source}</span>
                </TableCell>
                <TableCell>
                  <Select
                    value={lead.status}
                    onChange={(e) => {
                      e.stopPropagation();
                      onStatusChange(lead.id, e.target.value as LeadStatus);
                    }}
                    options={statusOptions.filter(o => o.value !== 'all')}
                    className="w-36"
                  />
                </TableCell>
                <TableCell>
                  <LeadPriorityBadge priority={lead.priority} />
                </TableCell>
                <TableCell>
                  {lead.assignedTo ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs">
                        {lead.assignedTo.name?.charAt(0)}
                      </div>
                      <span className="text-sm">{lead.assignedTo.name}</span>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Open assign modal
                      }}
                    >
                      <UserPlus size={14} className="mr-1" />
                      Assign
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-500">
                    {formatRelativeTime(lead.createdAt)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" onClick={() => onView(lead.id)}>
                      <Eye size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(lead.id)}>
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  );
}

// Lead Detail Component
interface LeadDetailProps {
  lead: Lead;
  onStatusChange: (status: LeadStatus) => void;
  onAddNote: (note: string) => void;
  onAssign: (userId: string) => void;
  locale: string;
}

export function LeadDetail({
  lead,
  onStatusChange,
  onAddNote,
  onAssign,
  locale
}: LeadDetailProps) {
  const [newNote, setNewNote] = useState('');
  const [sending, setSending] = useState(false);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setSending(true);
    try {
      await onAddNote(newNote);
      setNewNote('');
    } finally {
      setSending(false);
    }
  };

  const statusOptions: { value: LeadStatus; label: string }[] = [
    { value: 'NEW', label: 'New' },
    { value: 'CONTACTED', label: 'Contacted' },
    { value: 'QUALIFIED', label: 'Qualified' },
    { value: 'VIEWING_SCHEDULED', label: 'Viewing Scheduled' },
    { value: 'NEGOTIATING', label: 'Negotiating' },
    { value: 'CLOSED_WON', label: 'Won' },
    { value: 'CLOSED_LOST', label: 'Lost' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl">
                  {lead.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                  <p className="text-sm text-gray-500">Lead #{lead.id.slice(0, 8)}</p>
                </div>
              </div>
              <div className="space-y-2">
                <a
                  href={`mailto:${lead.email}`}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary"
                >
                  <Mail size={16} /> {lead.email}
                </a>
                {lead.phone && (
                  <a
                    href={`tel:${lead.phone}`}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary"
                  >
                    <Phone size={16} /> {lead.phone}
                  </a>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <Select
                  value={lead.status}
                  onChange={(e) => onStatusChange(e.target.value as LeadStatus)}
                  options={statusOptions}
                  className="w-40"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Priority</span>
                <LeadPriorityBadge priority={lead.priority} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Source</span>
                <span className="text-sm font-medium">{lead.source}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Created</span>
                <span className="text-sm">{formatDate(lead.createdAt)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Message */}
        {lead.message && (
          <Card>
            <CardHeader>
              <CardTitle>Message</CardTitle>
            </CardHeader>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">{lead.message}</p>
            </div>
          </Card>
        )}

        {/* Property Interest */}
        {lead.property && (
          <Card>
            <CardHeader>
              <CardTitle>Property of Interest</CardTitle>
            </CardHeader>
            <Link
              href={`/${locale}/admin/properties/${lead.property.id}`}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-20 h-16 bg-gray-200 rounded overflow-hidden">
                {lead.property.images?.[0] && (
                  <img
                    src={lead.property.images[0].url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">
                  {lead.property.title?.en || lead.property.title?.tr}
                </h4>
                <p className="text-sm text-gray-500">
                  {lead.property.city}, {lead.property.district}
                </p>
              </div>
              <ChevronRight className="text-gray-400" />
            </Link>
          </Card>
        )}

        {/* Notes / Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Notes & Activity</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {/* Add Note */}
            <div className="flex gap-2">
              <Textarea
                placeholder="Add a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={2}
                className="flex-1"
              />
              <Button
                onClick={handleAddNote}
                loading={sending}
                disabled={!newNote.trim()}
              >
                <Send size={16} />
              </Button>
            </div>

            {/* Notes List */}
            <div className="space-y-3 pt-4 border-t">
              {lead.notes?.map((note, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-sm flex-shrink-0">
                    {note.userName?.charAt(0) || 'A'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{note.userName || 'Admin'}</span>
                      <span className="text-xs text-gray-400">
                        {formatRelativeTime(note.date)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{note.text}</p>
                  </div>
                </div>
              ))}
              {(!lead.notes || lead.notes.length === 0) && (
                <p className="text-sm text-gray-400 text-center py-4">No notes yet</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <div className="space-y-2">
            <a href={`mailto:${lead.email}`}>
              <Button variant="outline" className="w-full justify-start">
                <Mail size={16} className="mr-2" /> Send Email
              </Button>
            </a>
            {lead.phone && (
              <a href={`tel:${lead.phone}`}>
                <Button variant="outline" className="w-full justify-start">
                  <Phone size={16} className="mr-2" /> Call
                </Button>
              </a>
            )}
            <Button variant="outline" className="w-full justify-start">
              <Calendar size={16} className="mr-2" /> Schedule Viewing
            </Button>
          </div>
        </Card>

        {/* Assigned Agent */}
        <Card>
          <CardHeader>
            <CardTitle>Assigned Agent</CardTitle>
          </CardHeader>
          {lead.assignedTo ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                {lead.assignedTo.name?.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{lead.assignedTo.name}</p>
                <p className="text-sm text-gray-500">{lead.assignedTo.email}</p>
              </div>
            </div>
          ) : (
            <Button variant="outline" className="w-full">
              <UserPlus size={16} className="mr-2" /> Assign Agent
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}

// Lead Stats Component
interface LeadStatsProps {
  stats: {
    total: number;
    new: number;
    contacted: number;
    qualified: number;
    won: number;
    lost: number;
    conversionRate: number;
  };
}

export function LeadStats({ stats }: LeadStatsProps) {
  const statItems = [
    { label: 'Total Leads', value: stats.total, color: 'bg-blue-500' },
    { label: 'New', value: stats.new, color: 'bg-green-500' },
    { label: 'Contacted', value: stats.contacted, color: 'bg-yellow-500' },
    { label: 'Qualified', value: stats.qualified, color: 'bg-purple-500' },
    { label: 'Won', value: stats.won, color: 'bg-emerald-500' },
    { label: 'Lost', value: stats.lost, color: 'bg-red-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statItems.map((item) => (
        <Card key={item.label} className="text-center">
          <div className={cn('w-3 h-3 rounded-full mx-auto mb-2', item.color)} />
          <p className="text-2xl font-bold">{item.value}</p>
          <p className="text-xs text-gray-500">{item.label}</p>
        </Card>
      ))}
    </div>
  );
}
