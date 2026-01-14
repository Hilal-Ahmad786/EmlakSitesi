'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { X, ChevronDown, ChevronUp, Save, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useSavedSearches, SavedSearch } from '@/context/SavedSearchContext';
import { cn } from '@/lib/utils';

export interface FilterValues {
  location: string;
  propertyType: string;
  listingType: string;
  minPrice: string;
  maxPrice: string;
  minBeds: string;
  maxBeds: string;
  minBaths: string;
  maxBaths: string;
  minSize: string;
  maxSize: string;
  yearBuilt: string;
  parking: string;
  amenities: string[];
}

interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
  initialFilters?: Partial<FilterValues>;
}

const defaultFilters: FilterValues = {
  location: '',
  propertyType: '',
  listingType: '',
  minPrice: '',
  maxPrice: '',
  minBeds: '',
  maxBeds: '',
  minBaths: '',
  maxBaths: '',
  minSize: '',
  maxSize: '',
  yearBuilt: '',
  parking: '',
  amenities: [],
};

const propertyTypes = [
  { value: '', label: 'All Types' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'yali', label: 'Yalı' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'office', label: 'Office' },
];

const listingTypes = [
  { value: '', label: 'All Listings' },
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
];

const locations = [
  { value: '', label: 'All Locations' },
  { value: 'bebek', label: 'Bebek' },
  { value: 'galata', label: 'Galata' },
  { value: 'nisantasi', label: 'Nişantaşı' },
  { value: 'cihangir', label: 'Cihangir' },
  { value: 'sariyer', label: 'Sarıyer' },
  { value: 'kandilli', label: 'Kandilli' },
  { value: 'levent', label: 'Levent' },
];

const amenitiesList = [
  { id: 'pool', label: 'Swimming Pool' },
  { id: 'gym', label: 'Gym' },
  { id: 'parking', label: 'Parking' },
  { id: 'garden', label: 'Garden' },
  { id: 'terrace', label: 'Terrace' },
  { id: 'sea-view', label: 'Sea View' },
  { id: 'city-view', label: 'City View' },
  { id: 'security', label: '24/7 Security' },
  { id: 'elevator', label: 'Elevator' },
  { id: 'smart-home', label: 'Smart Home' },
  { id: 'fireplace', label: 'Fireplace' },
  { id: 'sauna', label: 'Sauna' },
];

const quickFilters = [
  { id: 'luxury', label: 'Luxury Properties', filters: { minPrice: '2000000' } },
  { id: 'new', label: 'New Listings', filters: {} },
  { id: 'sea-view', label: 'Sea View', filters: { amenities: ['sea-view'] } },
  { id: 'family', label: 'Family Homes', filters: { minBeds: '3' } },
];

export function AdvancedFilters({
  isOpen,
  onClose,
  onApply,
  initialFilters,
}: AdvancedFiltersProps) {
  const t = useTranslations('Properties.filters');
  const { savedSearches, addSearch } = useSavedSearches();

  const [filters, setFilters] = useState<FilterValues>({
    ...defaultFilters,
    ...initialFilters,
  });
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    rooms: true,
    size: false,
    amenities: false,
    saved: false,
  });
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [searchName, setSearchName] = useState('');

  const updateFilter = useCallback(
    <K extends keyof FilterValues>(key: K, value: FilterValues[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const toggleAmenity = (amenityId: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((a) => a !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleReset = () => {
    setFilters(defaultFilters);
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleSaveSearch = () => {
    if (!searchName.trim()) return;

    addSearch({
      name: searchName,
      filters: {
        location: filters.location || undefined,
        propertyType: filters.propertyType || undefined,
        listingType: filters.listingType as 'sale' | 'rent' | 'both' | undefined,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        minBeds: filters.minBeds ? Number(filters.minBeds) : undefined,
        maxBeds: filters.maxBeds ? Number(filters.maxBeds) : undefined,
        minBaths: filters.minBaths ? Number(filters.minBaths) : undefined,
        maxBaths: filters.maxBaths ? Number(filters.maxBaths) : undefined,
        minSize: filters.minSize ? Number(filters.minSize) : undefined,
        maxSize: filters.maxSize ? Number(filters.maxSize) : undefined,
        amenities: filters.amenities.length > 0 ? filters.amenities : undefined,
      },
      alertEnabled: false,
      alertFrequency: 'daily',
    });

    setSearchName('');
    setShowSaveModal(false);
  };

  const applyQuickFilter = (quickFilter: (typeof quickFilters)[0]) => {
    setFilters((prev) => ({
      ...prev,
      ...quickFilter.filters,
      amenities: quickFilter.filters.amenities || prev.amenities,
    }));
  };

  const applySavedSearch = (search: SavedSearch) => {
    setFilters({
      ...defaultFilters,
      location: search.filters.location || '',
      propertyType: search.filters.propertyType || '',
      listingType: search.filters.listingType || '',
      minPrice: search.filters.minPrice?.toString() || '',
      maxPrice: search.filters.maxPrice?.toString() || '',
      minBeds: search.filters.minBeds?.toString() || '',
      maxBeds: search.filters.maxBeds?.toString() || '',
      minBaths: search.filters.minBaths?.toString() || '',
      maxBaths: search.filters.maxBaths?.toString() || '',
      minSize: search.filters.minSize?.toString() || '',
      maxSize: search.filters.maxSize?.toString() || '',
      amenities: search.filters.amenities || [],
    });
  };

  const hasActiveFilters =
    filters.location ||
    filters.propertyType ||
    filters.listingType ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.minBeds ||
    filters.amenities.length > 0;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 w-full max-w-md bg-white z-50 shadow-2xl',
          'flex flex-col transform transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-primary">
              {t('advancedFilters')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Quick Filters */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              {t('quickFilters')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {quickFilters.map((qf) => (
                <button
                  key={qf.id}
                  onClick={() => applyQuickFilter(qf)}
                  className="px-3 py-1.5 text-sm rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
                >
                  {qf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Basic Filters */}
          <div className="space-y-4">
            <Select
              label={t('location')}
              options={locations}
              value={filters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
            />
            <Select
              label={t('type')}
              options={propertyTypes}
              value={filters.propertyType}
              onChange={(e) => updateFilter('propertyType', e.target.value)}
            />
            <Select
              label={t('listingType')}
              options={listingTypes}
              value={filters.listingType}
              onChange={(e) => updateFilter('listingType', e.target.value)}
            />
          </div>

          {/* Price Section */}
          <div className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('price')}
              className="w-full flex items-center justify-between p-4 bg-gray-50"
            >
              <span className="font-medium text-gray-700">{t('price')}</span>
              {expandedSections.price ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
            {expandedSections.price && (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label={t('minPrice')}
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                  />
                  <Input
                    label={t('maxPrice')}
                    type="number"
                    placeholder="No max"
                    value={filters.maxPrice}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Rooms Section */}
          <div className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('rooms')}
              className="w-full flex items-center justify-between p-4 bg-gray-50"
            >
              <span className="font-medium text-gray-700">{t('rooms')}</span>
              {expandedSections.rooms ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
            {expandedSections.rooms && (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label={t('minBeds')}
                    type="number"
                    placeholder="Any"
                    value={filters.minBeds}
                    onChange={(e) => updateFilter('minBeds', e.target.value)}
                  />
                  <Input
                    label={t('maxBeds')}
                    type="number"
                    placeholder="Any"
                    value={filters.maxBeds}
                    onChange={(e) => updateFilter('maxBeds', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label={t('minBaths')}
                    type="number"
                    placeholder="Any"
                    value={filters.minBaths}
                    onChange={(e) => updateFilter('minBaths', e.target.value)}
                  />
                  <Input
                    label={t('maxBaths')}
                    type="number"
                    placeholder="Any"
                    value={filters.maxBaths}
                    onChange={(e) => updateFilter('maxBaths', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Size Section */}
          <div className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('size')}
              className="w-full flex items-center justify-between p-4 bg-gray-50"
            >
              <span className="font-medium text-gray-700">{t('size')}</span>
              {expandedSections.size ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
            {expandedSections.size && (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label={t('minSize')}
                    type="number"
                    placeholder="0 m²"
                    value={filters.minSize}
                    onChange={(e) => updateFilter('minSize', e.target.value)}
                  />
                  <Input
                    label={t('maxSize')}
                    type="number"
                    placeholder="No max"
                    value={filters.maxSize}
                    onChange={(e) => updateFilter('maxSize', e.target.value)}
                  />
                </div>
                <Input
                  label={t('yearBuilt')}
                  type="number"
                  placeholder="e.g. 2020"
                  value={filters.yearBuilt}
                  onChange={(e) => updateFilter('yearBuilt', e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Amenities Section */}
          <div className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('amenities')}
              className="w-full flex items-center justify-between p-4 bg-gray-50"
            >
              <span className="font-medium text-gray-700">{t('amenities')}</span>
              {expandedSections.amenities ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
            {expandedSections.amenities && (
              <div className="p-4">
                <div className="grid grid-cols-2 gap-2">
                  {amenitiesList.map((amenity) => (
                    <label
                      key={amenity.id}
                      className={cn(
                        'flex items-center gap-2 p-2 rounded cursor-pointer',
                        'hover:bg-gray-50 transition-colors',
                        filters.amenities.includes(amenity.id) && 'bg-primary/5'
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(amenity.id)}
                        onChange={() => toggleAmenity(amenity.id)}
                        className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">
                        {amenity.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Saved Searches Section */}
          {savedSearches.length > 0 && (
            <div className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('saved')}
                className="w-full flex items-center justify-between p-4 bg-gray-50"
              >
                <span className="font-medium text-gray-700">
                  {t('savedSearches')} ({savedSearches.length})
                </span>
                {expandedSections.saved ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
              {expandedSections.saved && (
                <div className="p-4 space-y-2">
                  {savedSearches.map((search) => (
                    <button
                      key={search.id}
                      onClick={() => applySavedSearch(search)}
                      className="w-full text-left p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      <p className="font-medium text-sm text-gray-800">
                        {search.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(search.createdAt).toLocaleDateString()}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-gray-50 space-y-3">
          {hasActiveFilters && (
            <button
              onClick={() => setShowSaveModal(true)}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm text-primary hover:underline"
            >
              <Save size={16} />
              {t('saveSearch')}
            </button>
          )}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleReset}
            >
              <RotateCcw size={16} className="mr-2" />
              {t('reset')}
            </Button>
            <Button className="flex-1" onClick={handleApply}>
              {t('apply')}
            </Button>
          </div>
        </div>
      </div>

      {/* Save Search Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-semibold text-primary mb-4">
              {t('saveSearchTitle')}
            </h3>
            <Input
              label={t('searchName')}
              placeholder={t('searchNamePlaceholder')}
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowSaveModal(false)}
              >
                {t('cancel')}
              </Button>
              <Button
                className="flex-1"
                onClick={handleSaveSearch}
                disabled={!searchName.trim()}
              >
                {t('save')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
