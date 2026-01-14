'use client';

import { useState } from 'react';
import {
  Calendar,
  ChevronDown,
  Download,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  CalendarEvent,
  downloadICS,
  generateGoogleCalendarUrl,
  generateOutlookUrl,
  generateOffice365Url,
  generateYahooCalendarUrl,
} from '@/lib/calendar';

interface AddToCalendarProps {
  event: CalendarEvent;
  variant?: 'button' | 'dropdown' | 'list';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onAdd?: (platform: string) => void;
}

const calendarOptions = [
  {
    id: 'google',
    name: 'Google Calendar',
    icon: '📅',
    getUrl: generateGoogleCalendarUrl,
  },
  {
    id: 'outlook',
    name: 'Outlook.com',
    icon: '📧',
    getUrl: generateOutlookUrl,
  },
  {
    id: 'office365',
    name: 'Office 365',
    icon: '💼',
    getUrl: generateOffice365Url,
  },
  {
    id: 'yahoo',
    name: 'Yahoo Calendar',
    icon: '📆',
    getUrl: generateYahooCalendarUrl,
  },
  {
    id: 'ics',
    name: 'Download ICS',
    icon: '⬇️',
    getUrl: null, // Special handling
  },
];

export function AddToCalendar({
  event,
  variant = 'dropdown',
  size = 'md',
  className,
  onAdd,
}: AddToCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };

  const handleCalendarClick = (option: (typeof calendarOptions)[0]) => {
    if (option.id === 'ics') {
      downloadICS(event);
    } else if (option.getUrl) {
      window.open(option.getUrl(event), '_blank');
    }

    setIsOpen(false);
    onAdd?.(option.id);
  };

  // Simple button variant - downloads ICS directly
  if (variant === 'button') {
    return (
      <button
        onClick={() => {
          downloadICS(event);
          onAdd?.('ics');
        }}
        className={cn(
          'inline-flex items-center gap-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors',
          sizeClasses[size],
          className
        )}
      >
        <Calendar size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} />
        Add to Calendar
      </button>
    );
  }

  // List variant - shows all options
  if (variant === 'list') {
    return (
      <div className={cn('space-y-2', className)}>
        <p className="text-sm font-medium text-gray-700 mb-3">Add to Calendar</p>
        {calendarOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleCalendarClick(option)}
            className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
          >
            <span className="text-xl">{option.icon}</span>
            <span className="text-sm font-medium text-gray-700">{option.name}</span>
            {option.id === 'ics' ? (
              <Download size={16} className="ml-auto text-gray-400" />
            ) : (
              <ExternalLink size={16} className="ml-auto text-gray-400" />
            )}
          </button>
        ))}
      </div>
    );
  }

  // Dropdown variant (default)
  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'inline-flex items-center gap-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors',
          sizeClasses[size]
        )}
      >
        <Calendar size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} />
        Add to Calendar
        <ChevronDown
          size={size === 'sm' ? 14 : 16}
          className={cn('transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full mt-2 right-0 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 animate-scale-up">
            {calendarOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleCalendarClick(option)}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
              >
                <span className="text-lg">{option.icon}</span>
                <span className="text-sm text-gray-700">{option.name}</span>
                {option.id === 'ics' ? (
                  <Download size={14} className="ml-auto text-gray-400" />
                ) : (
                  <ExternalLink size={14} className="ml-auto text-gray-400" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Confirmation component shown after scheduling
interface ViewingConfirmationProps {
  event: CalendarEvent;
  appointmentRef?: string;
  onClose?: () => void;
  className?: string;
}

export function ViewingConfirmation({
  event,
  appointmentRef,
  onClose,
  className,
}: ViewingConfirmationProps) {
  return (
    <div className={cn('bg-white rounded-xl border border-gray-200 p-6', className)}>
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <Calendar size={32} className="text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Viewing Scheduled!
        </h3>
        <p className="text-gray-600">
          Your property viewing has been confirmed.
        </p>
      </div>

      {/* Event Details */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        {appointmentRef && (
          <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
            <span className="text-sm text-gray-500">Reference</span>
            <span className="text-sm font-mono font-medium">{appointmentRef}</span>
          </div>
        )}
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Date</span>
          <span className="text-sm font-medium">
            {event.startDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Time</span>
          <span className="text-sm font-medium">
            {event.startDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        {event.location && (
          <div className="flex justify-between items-start">
            <span className="text-sm text-gray-500">Location</span>
            <span className="text-sm font-medium text-right max-w-[200px]">
              {event.location}
            </span>
          </div>
        )}
      </div>

      {/* Add to Calendar */}
      <AddToCalendar event={event} variant="list" />

      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Close
        </button>
      )}
    </div>
  );
}

export default AddToCalendar;
