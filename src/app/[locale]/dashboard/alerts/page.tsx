'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { DashboardSidebar } from '@/components/features/dashboard/DashboardSidebar';
import { useAlerts, PropertyAlert } from '@/context/AlertsContext';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  Bell,
  BellOff,
  Plus,
  Trash2,
  Edit2,
  X,
  MapPin,
  Home,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AlertsPage() {
  const t = useTranslations('Dashboard');
  const { alerts, addAlert, updateAlert, deleteAlert, toggleAlert } = useAlerts();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAlert, setEditingAlert] = useState<PropertyAlert | null>(null);
  const locale = 'en';

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    propertyType: '',
    listingType: '',
    minPrice: '',
    maxPrice: '',
    minBeds: '',
    frequency: 'daily' as 'instant' | 'daily' | 'weekly',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      propertyType: '',
      listingType: '',
      minPrice: '',
      maxPrice: '',
      minBeds: '',
      frequency: 'daily',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const alertData = {
      name: formData.name,
      criteria: {
        locations: formData.location ? [formData.location] : undefined,
        propertyTypes: formData.propertyType ? [formData.propertyType] : undefined,
        listingType: formData.listingType as 'sale' | 'rent' | 'both' | undefined,
        minPrice: formData.minPrice ? Number(formData.minPrice) : undefined,
        maxPrice: formData.maxPrice ? Number(formData.maxPrice) : undefined,
        minBeds: formData.minBeds ? Number(formData.minBeds) : undefined,
      },
      frequency: formData.frequency,
      isActive: true,
    };

    if (editingAlert) {
      updateAlert(editingAlert.id, alertData);
    } else {
      addAlert(alertData);
    }

    resetForm();
    setShowCreateModal(false);
    setEditingAlert(null);
  };

  const handleEdit = (alert: PropertyAlert) => {
    setEditingAlert(alert);
    setFormData({
      name: alert.name,
      location: alert.criteria.locations?.[0] || '',
      propertyType: alert.criteria.propertyTypes?.[0] || '',
      listingType: alert.criteria.listingType || '',
      minPrice: alert.criteria.minPrice?.toString() || '',
      maxPrice: alert.criteria.maxPrice?.toString() || '',
      minBeds: alert.criteria.minBeds?.toString() || '',
      frequency: alert.frequency,
    });
    setShowCreateModal(true);
  };

  const locations = [
    { value: '', label: 'Any Location' },
    { value: 'bebek', label: 'Bebek' },
    { value: 'galata', label: 'Galata' },
    { value: 'nisantasi', label: 'Nişantaşı' },
    { value: 'cihangir', label: 'Cihangir' },
  ];

  const propertyTypes = [
    { value: '', label: 'Any Type' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'villa', label: 'Villa' },
    { value: 'penthouse', label: 'Penthouse' },
  ];

  const frequencies = [
    { value: 'instant', label: 'Instant' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <div className="bg-primary-dark text-white py-12 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-4xl mb-2">
            {t('alerts.title')}
          </h1>
          <p className="text-gray-300">{t('alerts.subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <DashboardSidebar locale={locale} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Create Button */}
            <div className="flex justify-end">
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus size={18} className="mr-2" />
                {t('alerts.create')}
              </Button>
            </div>

            {/* Alerts List */}
            {alerts.length > 0 ? (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={cn(
                      'bg-white rounded-xl border overflow-hidden transition-all',
                      alert.isActive ? 'border-green-200' : 'border-border opacity-75'
                    )}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className={cn(
                                'w-10 h-10 rounded-lg flex items-center justify-center',
                                alert.isActive
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-gray-100 text-gray-400'
                              )}
                            >
                              {alert.isActive ? (
                                <Bell size={20} />
                              ) : (
                                <BellOff size={20} />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {alert.name}
                              </h3>
                              <span
                                className={cn(
                                  'text-xs font-medium',
                                  alert.isActive
                                    ? 'text-green-600'
                                    : 'text-gray-500'
                                )}
                              >
                                {alert.isActive ? 'Active' : 'Paused'} •{' '}
                                {alert.frequency}
                              </span>
                            </div>
                          </div>

                          {/* Criteria Tags */}
                          <div className="flex flex-wrap gap-2 mt-4">
                            {alert.criteria.locations?.map((loc) => (
                              <span
                                key={loc}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                              >
                                <MapPin size={12} />
                                {loc}
                              </span>
                            ))}
                            {alert.criteria.propertyTypes?.map((type) => (
                              <span
                                key={type}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                              >
                                <Home size={12} />
                                {type}
                              </span>
                            ))}
                            {(alert.criteria.minPrice ||
                              alert.criteria.maxPrice) && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                <DollarSign size={12} />€
                                {alert.criteria.minPrice?.toLocaleString() || '0'} -
                                €
                                {alert.criteria.maxPrice?.toLocaleString() ||
                                  'No max'}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleAlert(alert.id)}
                            className={cn(
                              'p-2 rounded-lg transition-colors',
                              alert.isActive
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-gray-400 hover:bg-gray-100'
                            )}
                            title={alert.isActive ? 'Pause alert' : 'Resume alert'}
                          >
                            {alert.isActive ? (
                              <Bell size={18} />
                            ) : (
                              <BellOff size={18} />
                            )}
                          </button>
                          <button
                            onClick={() => handleEdit(alert)}
                            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => deleteAlert(alert.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-3 bg-gray-50 border-t border-border flex items-center justify-between">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={12} />
                        Created{' '}
                        {new Date(alert.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {alert.matchCount} matches found
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-xl border border-border p-12 text-center">
                <Bell size={64} className="mx-auto text-gray-300 mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('alerts.empty')}
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {t('alerts.emptyDesc')}
                </p>
                <Button size="lg" onClick={() => setShowCreateModal(true)}>
                  <Plus size={18} className="mr-2" />
                  {t('alerts.createFirst')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingAlert ? t('alerts.edit') : t('alerts.create')}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingAlert(null);
                  resetForm();
                }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Input
                label={t('alerts.form.name')}
                placeholder="e.g., Luxury apartments in Bebek"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label={t('alerts.form.location')}
                  options={locations}
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
                <Select
                  label={t('alerts.form.propertyType')}
                  options={propertyTypes}
                  value={formData.propertyType}
                  onChange={(e) =>
                    setFormData({ ...formData, propertyType: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={t('alerts.form.minPrice')}
                  type="number"
                  placeholder="0"
                  value={formData.minPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, minPrice: e.target.value })
                  }
                />
                <Input
                  label={t('alerts.form.maxPrice')}
                  type="number"
                  placeholder="No max"
                  value={formData.maxPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, maxPrice: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={t('alerts.form.minBeds')}
                  type="number"
                  placeholder="Any"
                  value={formData.minBeds}
                  onChange={(e) =>
                    setFormData({ ...formData, minBeds: e.target.value })
                  }
                />
                <Select
                  label={t('alerts.form.frequency')}
                  options={frequencies}
                  value={formData.frequency}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      frequency: e.target.value as 'instant' | 'daily' | 'weekly',
                    })
                  }
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingAlert(null);
                    resetForm();
                  }}
                >
                  {t('alerts.form.cancel')}
                </Button>
                <Button type="submit" className="flex-1">
                  {editingAlert ? t('alerts.form.save') : t('alerts.form.create')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
