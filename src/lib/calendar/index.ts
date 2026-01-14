// Calendar Sync - ICS Generation and Calendar Integration

export interface CalendarEvent {
  title: string;
  description: string;
  location?: string;
  startDate: Date;
  endDate: Date;
  organizer?: {
    name: string;
    email: string;
  };
  attendees?: Array<{
    name: string;
    email: string;
  }>;
  url?: string;
  reminder?: number; // minutes before
  uid?: string;
}

// Generate a unique ID for the event
function generateUID(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@maisondorient.com`;
}

// Format date to ICS format (YYYYMMDDTHHMMSSZ)
function formatDateToICS(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

// Escape special characters in ICS
function escapeICS(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

// Fold long lines (ICS spec requires max 75 chars per line)
function foldLine(line: string): string {
  const maxLength = 75;
  if (line.length <= maxLength) return line;

  const result: string[] = [];
  let remaining = line;

  while (remaining.length > maxLength) {
    result.push(remaining.substring(0, maxLength));
    remaining = ' ' + remaining.substring(maxLength);
  }
  result.push(remaining);

  return result.join('\r\n');
}

// Generate ICS file content
export function generateICS(event: CalendarEvent): string {
  const uid = event.uid || generateUID();
  const now = new Date();

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Maison d\'Orient//Property Viewing//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatDateToICS(now)}`,
    `DTSTART:${formatDateToICS(event.startDate)}`,
    `DTEND:${formatDateToICS(event.endDate)}`,
    `SUMMARY:${escapeICS(event.title)}`,
  ];

  if (event.description) {
    lines.push(`DESCRIPTION:${escapeICS(event.description)}`);
  }

  if (event.location) {
    lines.push(`LOCATION:${escapeICS(event.location)}`);
  }

  if (event.url) {
    lines.push(`URL:${event.url}`);
  }

  if (event.organizer) {
    lines.push(
      `ORGANIZER;CN=${escapeICS(event.organizer.name)}:mailto:${event.organizer.email}`
    );
  }

  if (event.attendees) {
    event.attendees.forEach((attendee) => {
      lines.push(
        `ATTENDEE;CN=${escapeICS(attendee.name)};RSVP=TRUE:mailto:${attendee.email}`
      );
    });
  }

  if (event.reminder) {
    lines.push('BEGIN:VALARM');
    lines.push('ACTION:DISPLAY');
    lines.push(`DESCRIPTION:${escapeICS(event.title)} - Reminder`);
    lines.push(`TRIGGER:-PT${event.reminder}M`);
    lines.push('END:VALARM');
  }

  lines.push('END:VEVENT');
  lines.push('END:VCALENDAR');

  // Fold long lines and join with CRLF
  return lines.map(foldLine).join('\r\n');
}

// Download ICS file
export function downloadICS(event: CalendarEvent, filename?: string): void {
  const icsContent = generateICS(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `${event.title.replace(/[^a-z0-9]/gi, '_')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Generate Google Calendar URL
export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatDateToICS(event.startDate).replace('Z', '')}/${formatDateToICS(event.endDate).replace('Z', '')}`,
  });

  if (event.description) {
    params.set('details', event.description);
  }

  if (event.location) {
    params.set('location', event.location);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Generate Outlook.com URL
export function generateOutlookUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    startdt: event.startDate.toISOString(),
    enddt: event.endDate.toISOString(),
  });

  if (event.description) {
    params.set('body', event.description);
  }

  if (event.location) {
    params.set('location', event.location);
  }

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

// Generate Office 365 URL
export function generateOffice365Url(event: CalendarEvent): string {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    startdt: event.startDate.toISOString(),
    enddt: event.endDate.toISOString(),
  });

  if (event.description) {
    params.set('body', event.description);
  }

  if (event.location) {
    params.set('location', event.location);
  }

  return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`;
}

// Generate Yahoo Calendar URL
export function generateYahooCalendarUrl(event: CalendarEvent): string {
  const formatYahooDate = (date: Date) =>
    date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '').replace('Z', '');

  const params = new URLSearchParams({
    v: '60',
    title: event.title,
    st: formatYahooDate(event.startDate),
    et: formatYahooDate(event.endDate),
    in_loc: event.location || '',
    desc: event.description || '',
  });

  return `https://calendar.yahoo.com/?${params.toString()}`;
}

// Property viewing event helper
export function createPropertyViewingEvent(params: {
  propertyTitle: string;
  propertyAddress: string;
  viewingDate: Date;
  durationMinutes?: number;
  agentName: string;
  agentEmail: string;
  agentPhone?: string;
  clientName: string;
  clientEmail: string;
  propertyUrl?: string;
}): CalendarEvent {
  const {
    propertyTitle,
    propertyAddress,
    viewingDate,
    durationMinutes = 30,
    agentName,
    agentEmail,
    agentPhone,
    clientName,
    clientEmail,
    propertyUrl,
  } = params;

  const endDate = new Date(viewingDate.getTime() + durationMinutes * 60 * 1000);

  let description = `Property Viewing: ${propertyTitle}\n\n`;
  description += `Address: ${propertyAddress}\n\n`;
  description += `Your Agent:\n`;
  description += `${agentName}\n`;
  description += `Email: ${agentEmail}\n`;
  if (agentPhone) {
    description += `Phone: ${agentPhone}\n`;
  }
  if (propertyUrl) {
    description += `\nView Property Details: ${propertyUrl}`;
  }

  return {
    title: `Property Viewing - ${propertyTitle}`,
    description,
    location: propertyAddress,
    startDate: viewingDate,
    endDate,
    organizer: {
      name: agentName,
      email: agentEmail,
    },
    attendees: [
      { name: clientName, email: clientEmail },
    ],
    url: propertyUrl,
    reminder: 60, // 1 hour before
  };
}

// Appointment event helper
export function createAppointmentEvent(params: {
  title: string;
  appointmentDate: Date;
  durationMinutes?: number;
  meetingType: 'office' | 'property' | 'video';
  location?: string;
  videoLink?: string;
  agentName: string;
  agentEmail: string;
  notes?: string;
}): CalendarEvent {
  const {
    title,
    appointmentDate,
    durationMinutes = 60,
    meetingType,
    location,
    videoLink,
    agentName,
    agentEmail,
    notes,
  } = params;

  const endDate = new Date(appointmentDate.getTime() + durationMinutes * 60 * 1000);

  let description = `Appointment Type: ${meetingType === 'office' ? 'Office Meeting' : meetingType === 'property' ? 'Property Visit' : 'Video Call'}\n\n`;

  if (meetingType === 'video' && videoLink) {
    description += `Join Video Call: ${videoLink}\n\n`;
  }

  description += `Your Consultant:\n${agentName}\n${agentEmail}\n`;

  if (notes) {
    description += `\nNotes: ${notes}`;
  }

  return {
    title,
    description,
    location: meetingType === 'video' ? videoLink : location,
    startDate: appointmentDate,
    endDate,
    organizer: {
      name: agentName,
      email: agentEmail,
    },
    reminder: 30, // 30 minutes before
  };
}

export default {
  generateICS,
  downloadICS,
  generateGoogleCalendarUrl,
  generateOutlookUrl,
  generateOffice365Url,
  generateYahooCalendarUrl,
  createPropertyViewingEvent,
  createAppointmentEvent,
};
