'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import {
  FileText,
  Image,
  FileCheck,
  Zap,
  Map,
  Download,
  Send,
  Check,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

interface DocumentRequestProps {
  propertyId: string;
  propertyTitle: string;
  className?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  documents: string[];
  message: string;
  preferredContact: 'email' | 'phone' | 'whatsapp';
}

const documentTypes = [
  {
    id: 'floor-plan',
    label: 'Floor Plan',
    icon: Map,
    description: 'Detailed architectural layout',
  },
  {
    id: 'title-deed',
    label: 'Title Deed',
    icon: FileCheck,
    description: 'Property ownership document',
  },
  {
    id: 'energy-cert',
    label: 'Energy Certificate',
    icon: Zap,
    description: 'Energy efficiency rating',
  },
  {
    id: 'photos-hd',
    label: 'HD Photos',
    icon: Image,
    description: 'High resolution images',
  },
  {
    id: 'brochure',
    label: 'Property Brochure',
    icon: FileText,
    description: 'Complete property details',
  },
];

const contactMethods = [
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'whatsapp', label: 'WhatsApp' },
];

export function DocumentRequest({
  propertyId,
  propertyTitle,
  className,
}: DocumentRequestProps) {
  const t = useTranslations('PropertyDetail');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      preferredContact: 'email',
    },
  });

  const toggleDocument = (docId: string) => {
    setSelectedDocs((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    );
  };

  const onSubmit = async (data: FormData) => {
    if (selectedDocs.length === 0) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log('Document request:', {
      ...data,
      documents: selectedDocs,
      propertyId,
      propertyTitle,
    });

    setIsSubmitting(false);
    setIsSuccess(true);
    reset();
    setSelectedDocs([]);

    // Reset success state after 3 seconds
    setTimeout(() => setIsSuccess(false), 3000);
  };

  if (isSuccess) {
    return (
      <div className={cn('bg-green-50 rounded-xl p-8 text-center', className)}>
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <Check size={32} className="text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          {t('documents.success')}
        </h3>
        <p className="text-green-600">{t('documents.successDesc')}</p>
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-xl border border-border p-6', className)}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Download size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">
            {t('documents.title')}
          </h3>
          <p className="text-sm text-gray-500">{t('documents.subtitle')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Document Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('documents.selectDocuments')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {documentTypes.map((doc) => {
              const Icon = doc.icon;
              const isSelected = selectedDocs.includes(doc.id);

              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => toggleDocument(doc.id)}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg border-2 text-left transition-all',
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-gray-300'
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      isSelected
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-500'
                    )}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'font-medium text-sm',
                        isSelected ? 'text-primary' : 'text-gray-900'
                      )}
                    >
                      {doc.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {doc.description}
                    </p>
                  </div>
                  {isSelected && (
                    <Check size={16} className="text-primary flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
          {selectedDocs.length === 0 && (
            <p className="text-xs text-gray-500 mt-2">
              {t('documents.selectAtLeastOne')}
            </p>
          )}
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <Input
            label={t('documents.form.name')}
            placeholder="John Doe"
            {...register('name', { required: true })}
            error={errors.name && 'Name is required'}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('documents.form.email')}
              type="email"
              placeholder="john@example.com"
              {...register('email', { required: true })}
              error={errors.email && 'Email is required'}
            />
            <Input
              label={t('documents.form.phone')}
              placeholder="+90 555 123 45 67"
              {...register('phone')}
            />
          </div>
        </div>

        {/* Preferred Contact Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('documents.form.preferredContact')}
          </label>
          <div className="flex gap-3">
            {contactMethods.map((method) => (
              <label
                key={method.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  value={method.id}
                  {...register('preferredContact')}
                  className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{method.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('documents.form.message')}
          </label>
          <textarea
            {...register('message')}
            placeholder={t('documents.form.messagePlaceholder')}
            className="w-full min-h-[80px] rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || selectedDocs.length === 0}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" />
              {t('documents.sending')}
            </>
          ) : (
            <>
              <Send size={18} className="mr-2" />
              {t('documents.submit')}
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
