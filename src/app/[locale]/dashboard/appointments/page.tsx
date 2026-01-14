'use client';

import { useTranslations } from 'next-intl';
import { DashboardSidebar } from '@/components/features/dashboard/DashboardSidebar';
import { useAppointments, Appointment } from '@/context/AppointmentsContext';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import {
  Calendar,
  Clock,
  MapPin,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AppointmentsPage() {
  const t = useTranslations('Dashboard');
  const {
    upcomingAppointments,
    pastAppointments,
    cancelAppointment,
    updateAppointment,
  } = useAppointments();
  const locale = 'en';

  const getStatusIcon = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-500" />;
      case 'completed':
        return <CheckCircle size={16} className="text-blue-500" />;
      default:
        return <AlertCircle size={16} className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const AppointmentCard = ({
    appointment,
    showActions = true,
  }: {
    appointment: Appointment;
    showActions?: boolean;
  }) => (
    <div
      className={cn(
        'bg-white rounded-xl border overflow-hidden',
        appointment.status === 'cancelled'
          ? 'border-red-200 opacity-75'
          : 'border-border'
      )}
    >
      <div className="flex gap-4 p-4">
        {/* Property Image */}
        <Link
          href={`/properties/${appointment.propertyId}`}
          className="relative w-24 h-20 rounded-lg overflow-hidden flex-shrink-0"
        >
          <img
            src={appointment.propertyImage}
            alt={appointment.propertyTitle}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <Link
                href={`/properties/${appointment.propertyId}`}
                className="font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-1"
              >
                {appointment.propertyTitle}
              </Link>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin size={12} />
                {appointment.propertyLocation}
              </p>
            </div>
            <span
              className={cn(
                'px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1',
                getStatusColor(appointment.status)
              )}
            >
              {getStatusIcon(appointment.status)}
              {appointment.status}
            </span>
          </div>

          {/* Date & Time */}
          <div className="flex items-center gap-4 mt-3 text-sm">
            <span className="flex items-center gap-1 text-gray-600">
              <Calendar size={14} className="text-primary" />
              {formatDate(appointment.date)}
            </span>
            <span className="flex items-center gap-1 text-gray-600">
              <Clock size={14} className="text-primary" />
              {appointment.time}
            </span>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
              {appointment.notes}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      {showActions && appointment.status === 'pending' && (
        <div className="flex gap-2 p-4 pt-0">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => cancelAppointment(appointment.id)}
          >
            <X size={14} className="mr-1" />
            Cancel
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() =>
              updateAppointment(appointment.id, { status: 'confirmed' })
            }
          >
            <CheckCircle size={14} className="mr-1" />
            Confirm
          </Button>
        </div>
      )}

      {/* Contact Info */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-border text-sm">
        <div className="flex items-center gap-4">
          <span className="text-gray-600">{appointment.contactName}</span>
          <a
            href={`mailto:${appointment.contactEmail}`}
            className="text-primary hover:underline flex items-center gap-1"
          >
            <Mail size={12} />
            {appointment.contactEmail}
          </a>
          {appointment.contactPhone && (
            <a
              href={`tel:${appointment.contactPhone}`}
              className="text-primary hover:underline flex items-center gap-1"
            >
              <Phone size={12} />
              {appointment.contactPhone}
            </a>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <div className="bg-primary-dark text-white py-12 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-4xl mb-2">
            {t('appointments.title')}
          </h1>
          <p className="text-gray-300">{t('appointments.subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <DashboardSidebar locale={locale} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Upcoming Appointments */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-primary" />
                {t('appointments.upcoming')}
                {upcomingAppointments.length > 0 && (
                  <span className="text-sm font-normal text-gray-500">
                    ({upcomingAppointments.length})
                  </span>
                )}
              </h2>

              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((apt) => (
                    <AppointmentCard key={apt.id} appointment={apt} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-border p-8 text-center">
                  <Calendar
                    size={48}
                    className="mx-auto text-gray-300 mb-4"
                  />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t('appointments.noUpcoming')}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {t('appointments.noUpcomingDesc')}
                  </p>
                  <Link href="/properties">
                    <Button>{t('appointments.browseProperties')}</Button>
                  </Link>
                </div>
              )}
            </section>

            {/* Past Appointments */}
            {pastAppointments.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock size={20} className="text-gray-400" />
                  {t('appointments.past')}
                  <span className="text-sm font-normal text-gray-500">
                    ({pastAppointments.length})
                  </span>
                </h2>

                <div className="space-y-4">
                  {pastAppointments.slice(0, 5).map((apt) => (
                    <AppointmentCard
                      key={apt.id}
                      appointment={apt}
                      showActions={false}
                    />
                  ))}
                </div>

                {pastAppointments.length > 5 && (
                  <button className="w-full mt-4 py-3 text-sm text-primary hover:underline">
                    {t('appointments.viewAllPast', {
                      count: pastAppointments.length,
                    })}
                  </button>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
