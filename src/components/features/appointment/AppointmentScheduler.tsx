'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Loader2,
  User,
  Mail,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAppointments } from '@/context/AppointmentsContext';
import { cn } from '@/lib/utils';

interface AppointmentSchedulerProps {
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyLocation: string;
  onClose?: () => void;
  className?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

const timeSlots = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];

export function AppointmentScheduler({
  propertyId,
  propertyTitle,
  propertyImage,
  propertyLocation,
  onClose,
  className,
}: AppointmentSchedulerProps) {
  const t = useTranslations('Appointment');
  const { addAppointment } = useAppointments();

  const [step, setStep] = useState<'date' | 'time' | 'form' | 'confirm'>('date');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const days: (Date | null)[] = [];

    // Add padding for days before the first
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  }, [currentMonth]);

  const isDateSelectable = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return date >= today && date <= maxDate && date.getDay() !== 0; // Exclude Sundays
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setStep('time');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep('form');
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedDate || !selectedTime) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    addAppointment({
      propertyId,
      propertyTitle,
      propertyImage,
      propertyLocation,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      contactName: data.name,
      contactEmail: data.email,
      contactPhone: data.phone,
      notes: data.notes,
    });

    setIsSubmitting(false);
    setStep('confirm');
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <div className={cn('bg-white rounded-xl border border-border overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/5 to-accent-gold/5">
        <div className="flex items-center gap-3">
          <Calendar size={24} className="text-primary" />
          <div>
            <h3 className="font-semibold text-gray-900">{t('title')}</h3>
            <p className="text-sm text-gray-500">{propertyTitle}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 p-4 border-b border-border bg-gray-50">
        {['date', 'time', 'form'].map((s, i) => (
          <div key={s} className="flex items-center">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                step === s
                  ? 'bg-primary text-white'
                  : i < ['date', 'time', 'form'].indexOf(step)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              )}
            >
              {i < ['date', 'time', 'form'].indexOf(step) ? (
                <Check size={14} />
              ) : (
                i + 1
              )}
            </div>
            {i < 2 && (
              <div
                className={cn(
                  'w-12 h-0.5 mx-1',
                  i < ['date', 'time', 'form'].indexOf(step)
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Step 1: Date Selection */}
        {step === 'date' && (
          <div>
            <h4 className="font-medium text-gray-900 mb-4">{t('selectDate')}</h4>

            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() - 1,
                      1
                    )
                  )
                }
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="font-medium text-gray-900">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() + 1,
                      1
                    )
                  )
                }
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-gray-500 py-2"
                >
                  {day}
                </div>
              ))}
              {calendarDays.map((date, index) => (
                <button
                  key={index}
                  disabled={!isDateSelectable(date)}
                  onClick={() => date && handleDateSelect(date)}
                  className={cn(
                    'aspect-square rounded-lg text-sm transition-colors',
                    !date && 'invisible',
                    date && isDateSelectable(date)
                      ? 'hover:bg-primary hover:text-white cursor-pointer'
                      : 'text-gray-300 cursor-not-allowed',
                    date &&
                      selectedDate?.toDateString() === date.toDateString() &&
                      'bg-primary text-white'
                  )}
                >
                  {date?.getDate()}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Time Selection */}
        {step === 'time' && (
          <div>
            <button
              onClick={() => setStep('date')}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-4"
            >
              <ChevronLeft size={16} />
              {t('back')}
            </button>

            <h4 className="font-medium text-gray-900 mb-2">{t('selectTime')}</h4>
            <p className="text-sm text-gray-500 mb-4">
              {selectedDate && formatDate(selectedDate)}
            </p>

            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={cn(
                    'flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors',
                    selectedTime === time
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-primary hover:bg-primary/5'
                  )}
                >
                  <Clock size={16} />
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Contact Form */}
        {step === 'form' && (
          <div>
            <button
              onClick={() => setStep('time')}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-4"
            >
              <ChevronLeft size={16} />
              {t('back')}
            </button>

            <h4 className="font-medium text-gray-900 mb-2">{t('yourDetails')}</h4>
            <p className="text-sm text-gray-500 mb-4">
              {selectedDate && formatDate(selectedDate)} at {selectedTime}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label={t('form.name')}
                placeholder="John Doe"
                icon={<User size={16} />}
                {...register('name', { required: true })}
                error={errors.name && t('form.required')}
              />
              <Input
                label={t('form.email')}
                type="email"
                placeholder="john@example.com"
                icon={<Mail size={16} />}
                {...register('email', { required: true })}
                error={errors.email && t('form.required')}
              />
              <Input
                label={t('form.phone')}
                placeholder="+90 555 123 45 67"
                icon={<Phone size={16} />}
                {...register('phone')}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('form.notes')}
                </label>
                <textarea
                  {...register('notes')}
                  placeholder={t('form.notesPlaceholder')}
                  className="w-full min-h-[80px] rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    {t('scheduling')}
                  </>
                ) : (
                  <>
                    <Calendar size={18} className="mr-2" />
                    {t('schedule')}
                  </>
                )}
              </Button>
            </form>
          </div>
        )}

        {/* Confirmation */}
        {step === 'confirm' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              {t('confirmed')}
            </h4>
            <p className="text-gray-500 mb-6">
              {t('confirmationMessage')}
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-left mb-6">
              <p className="font-medium text-gray-900">{propertyTitle}</p>
              <p className="text-sm text-gray-500 mt-1">
                {selectedDate && formatDate(selectedDate)} at {selectedTime}
              </p>
            </div>
            {onClose && (
              <Button onClick={onClose} variant="outline">
                {t('close')}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
