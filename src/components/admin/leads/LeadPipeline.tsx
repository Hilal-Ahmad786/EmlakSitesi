'use client';

import { useState } from 'react';
import { GripVertical, Phone, Mail, Calendar, MoreHorizontal, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  property?: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

interface PipelineColumn {
  id: string;
  title: string;
  color: string;
  leads: Lead[];
}

const initialColumns: PipelineColumn[] = [
  {
    id: 'new',
    title: 'New Leads',
    color: 'bg-blue-500',
    leads: [
      { id: '1', name: 'John Smith', email: 'john@example.com', phone: '+90 532 123 4567', property: 'Bosphorus Villa', createdAt: '2024-01-15', priority: 'high' },
      { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+90 533 234 5678', createdAt: '2024-01-14', priority: 'medium' },
    ],
  },
  {
    id: 'contacted',
    title: 'Contacted',
    color: 'bg-yellow-500',
    leads: [
      { id: '3', name: 'Mike Wilson', email: 'mike@example.com', phone: '+90 534 345 6789', property: 'Galata Apartment', createdAt: '2024-01-12', priority: 'high' },
    ],
  },
  {
    id: 'viewing',
    title: 'Viewing Scheduled',
    color: 'bg-purple-500',
    leads: [
      { id: '4', name: 'Emma Davis', email: 'emma@example.com', phone: '+90 535 456 7890', property: 'Levent Penthouse', createdAt: '2024-01-10', priority: 'medium' },
    ],
  },
  {
    id: 'negotiating',
    title: 'Negotiating',
    color: 'bg-orange-500',
    leads: [
      { id: '5', name: 'James Brown', email: 'james@example.com', phone: '+90 536 567 8901', property: 'Sarıyer Mansion', createdAt: '2024-01-08', priority: 'high' },
    ],
  },
  {
    id: 'closed',
    title: 'Closed Won',
    color: 'bg-green-500',
    leads: [],
  },
];

const priorityColors = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

interface LeadCardProps {
  lead: Lead;
  onDragStart: () => void;
}

function LeadCard({ lead, onDragStart }: LeadCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="bg-white rounded-lg border border-gray-200 p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-2">
        <GripVertical size={16} className="text-gray-400 mt-1 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-medium text-gray-900 truncate">{lead.name}</h4>
            <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full', priorityColors[lead.priority])}>
              {lead.priority}
            </span>
          </div>
          {lead.property && (
            <p className="text-sm text-primary mt-1 truncate">{lead.property}</p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <button className="flex items-center gap-1 hover:text-primary transition-colors">
              <Phone size={12} />
              Call
            </button>
            <button className="flex items-center gap-1 hover:text-primary transition-colors">
              <Mail size={12} />
              Email
            </button>
            <button className="flex items-center gap-1 hover:text-primary transition-colors">
              <Calendar size={12} />
              Schedule
            </button>
          </div>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
          <MoreHorizontal size={16} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
}

export function LeadPipeline() {
  const [columns, setColumns] = useState(initialColumns);
  const [draggedLead, setDraggedLead] = useState<{ lead: Lead; sourceColumnId: string } | null>(null);

  const handleDragStart = (lead: Lead, columnId: string) => {
    setDraggedLead({ lead, sourceColumnId: columnId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetColumnId: string) => {
    if (!draggedLead) return;
    if (draggedLead.sourceColumnId === targetColumnId) return;

    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === draggedLead.sourceColumnId) {
          return { ...col, leads: col.leads.filter((l) => l.id !== draggedLead.lead.id) };
        }
        if (col.id === targetColumnId) {
          return { ...col, leads: [...col.leads, draggedLead.lead] };
        }
        return col;
      })
    );

    setDraggedLead(null);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Lead Pipeline</h2>
          <p className="text-sm text-gray-500">Drag and drop leads to update their status</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
          <Plus size={18} />
          Add Lead
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div
            key={column.id}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
            className="flex-shrink-0 w-72"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={cn('w-3 h-3 rounded-full', column.color)} />
              <h3 className="font-medium text-gray-700">{column.title}</h3>
              <span className="ml-auto text-sm text-gray-400">{column.leads.length}</span>
            </div>
            <div
              className={cn(
                'min-h-[400px] p-2 rounded-lg border-2 border-dashed transition-colors space-y-2',
                draggedLead && draggedLead.sourceColumnId !== column.id
                  ? 'border-primary/50 bg-primary/5'
                  : 'border-gray-200 bg-gray-50'
              )}
            >
              {column.leads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onDragStart={() => handleDragStart(lead, column.id)}
                />
              ))}
              {column.leads.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-8">
                  No leads in this stage
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
