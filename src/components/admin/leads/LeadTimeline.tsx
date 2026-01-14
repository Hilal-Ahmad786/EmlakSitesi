'use client';

import { Phone, Mail, Calendar, MessageSquare, CheckCircle, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineEvent {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'status_change';
  title: string;
  description?: string;
  user: string;
  timestamp: string;
}

const mockEvents: TimelineEvent[] = [
  {
    id: '1',
    type: 'status_change',
    title: 'Status changed to Contacted',
    user: 'John Doe',
    timestamp: '2024-01-15T14:30:00',
  },
  {
    id: '2',
    type: 'call',
    title: 'Phone call - 5 minutes',
    description: 'Discussed property requirements. Client interested in 3BR apartments in Bebek area.',
    user: 'John Doe',
    timestamp: '2024-01-15T14:25:00',
  },
  {
    id: '3',
    type: 'email',
    title: 'Sent property brochure',
    description: 'Sent details of 3 matching properties via email.',
    user: 'John Doe',
    timestamp: '2024-01-14T10:15:00',
  },
  {
    id: '4',
    type: 'note',
    title: 'Added a note',
    description: 'Client has budget of €500K-€750K. Prefers modern buildings with sea view.',
    user: 'Sarah Smith',
    timestamp: '2024-01-13T16:45:00',
  },
  {
    id: '5',
    type: 'meeting',
    title: 'Viewing scheduled',
    description: 'Property viewing at Bosphorus Villa - January 20, 2024 at 2:00 PM',
    user: 'John Doe',
    timestamp: '2024-01-12T11:00:00',
  },
];

const eventIcons = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  note: MessageSquare,
  status_change: CheckCircle,
};

const eventColors = {
  call: 'bg-green-100 text-green-600',
  email: 'bg-blue-100 text-blue-600',
  meeting: 'bg-purple-100 text-purple-600',
  note: 'bg-yellow-100 text-yellow-600',
  status_change: 'bg-primary/10 text-primary',
};

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays === 1) {
    return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

interface LeadTimelineProps {
  leadId?: string;
  events?: TimelineEvent[];
}

export function LeadTimeline({ leadId, events = mockEvents }: LeadTimelineProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900">Activity Timeline</h3>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            Add Note
          </button>
          <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            Log Call
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200" />

        <div className="space-y-6">
          {events.map((event, index) => {
            const Icon = eventIcons[event.type];
            const colorClass = eventColors[event.type];

            return (
              <div key={event.id} className="relative flex gap-4">
                {/* Icon */}
                <div
                  className={cn(
                    'relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                    colorClass
                  )}
                >
                  <Icon size={18} />
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{event.title}</p>
                      {event.description && (
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {event.user}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {formatTimestamp(event.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {events.length === 0 && (
        <p className="text-center text-gray-500 py-8">No activity recorded yet</p>
      )}
    </div>
  );
}
