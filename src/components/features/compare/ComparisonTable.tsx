'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import {
  X,
  ChevronDown,
  ChevronUp,
  Printer,
  Share2,
  Check,
  Minus,
  Bed,
  Bath,
  Ruler,
  Calendar,
  MapPin,
  Building2,
  Car,
  Waves,
  Trees,
  Shield,
  Dumbbell,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCompare } from '@/context/CompareContext';
import { useCurrency } from '@/context/CurrencyContext';
import { cn } from '@/lib/utils';

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  priceValue: number;
  image: string;
  beds: number;
  baths: number;
  size: number;
  type: 'sale' | 'rent';
  propertyType?: string;
  yearBuilt?: number;
  parking?: number;
  features?: string[];
  amenities?: string[];
}

interface ComparisonTableProps {
  properties: Property[];
}

interface ComparisonSection {
  id: string;
  title: string;
  rows: {
    label: string;
    icon?: React.ReactNode;
    getValue: (property: Property) => string | number | boolean | undefined;
    format?: 'text' | 'number' | 'boolean' | 'currency' | 'area';
  }[];
}

const sections: ComparisonSection[] = [
  {
    id: 'basics',
    title: 'Basic Information',
    rows: [
      {
        label: 'Price',
        getValue: (p) => p.priceValue,
        format: 'currency',
      },
      {
        label: 'Price per m²',
        getValue: (p) => Math.round(p.priceValue / p.size),
        format: 'currency',
      },
      {
        label: 'Listing Type',
        getValue: (p) => (p.type === 'sale' ? 'For Sale' : 'For Rent'),
        format: 'text',
      },
      {
        label: 'Property Type',
        getValue: (p) => p.propertyType || 'Apartment',
        format: 'text',
      },
    ],
  },
  {
    id: 'specs',
    title: 'Specifications',
    rows: [
      {
        label: 'Bedrooms',
        icon: <Bed size={16} />,
        getValue: (p) => p.beds,
        format: 'number',
      },
      {
        label: 'Bathrooms',
        icon: <Bath size={16} />,
        getValue: (p) => p.baths,
        format: 'number',
      },
      {
        label: 'Size',
        icon: <Ruler size={16} />,
        getValue: (p) => p.size,
        format: 'area',
      },
      {
        label: 'Year Built',
        icon: <Calendar size={16} />,
        getValue: (p) => p.yearBuilt || 'N/A',
        format: 'text',
      },
      {
        label: 'Parking Spaces',
        icon: <Car size={16} />,
        getValue: (p) => p.parking || 0,
        format: 'number',
      },
    ],
  },
  {
    id: 'amenities',
    title: 'Amenities',
    rows: [
      {
        label: 'Swimming Pool',
        icon: <Waves size={16} />,
        getValue: (p) => p.amenities?.includes('pool'),
        format: 'boolean',
      },
      {
        label: 'Garden',
        icon: <Trees size={16} />,
        getValue: (p) => p.amenities?.includes('garden'),
        format: 'boolean',
      },
      {
        label: 'Gym',
        icon: <Dumbbell size={16} />,
        getValue: (p) => p.amenities?.includes('gym'),
        format: 'boolean',
      },
      {
        label: '24/7 Security',
        icon: <Shield size={16} />,
        getValue: (p) => p.amenities?.includes('security'),
        format: 'boolean',
      },
    ],
  },
];

export function ComparisonTable({ properties }: ComparisonTableProps) {
  const t = useTranslations('Compare');
  const { removeFromCompare, clearCompare } = useCompare();
  const { formatPrice, convertPrice } = useCurrency();
  const tableRef = useRef<HTMLDivElement>(null);

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    basics: true,
    specs: true,
    amenities: true,
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('shareTitle'),
          text: t('shareText'),
          url,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(url);
      alert(t('linkCopied'));
    }
  };

  const formatValue = (
    value: string | number | boolean | undefined,
    format?: string
  ) => {
    if (value === undefined || value === null) {
      return <span className="text-gray-400">—</span>;
    }

    switch (format) {
      case 'currency':
        return (
          <span className="font-semibold text-accent-gold">
            {formatPrice(convertPrice(Number(value)))}
          </span>
        );
      case 'area':
        return (
          <span>
            {value} m<sup>2</sup>
          </span>
        );
      case 'boolean':
        return value ? (
          <Check size={18} className="text-green-500 mx-auto" />
        ) : (
          <Minus size={18} className="text-gray-300 mx-auto" />
        );
      case 'number':
        return <span className="font-medium">{value}</span>;
      default:
        return <span>{value}</span>;
    }
  };

  // Find best value for highlighting
  const getBestValue = (
    values: (string | number | boolean | undefined)[],
    format?: string
  ): number => {
    if (format === 'currency') {
      // For price, lower is better
      const numValues = values.map((v) =>
        typeof v === 'number' ? v : Infinity
      );
      const minValue = Math.min(...numValues);
      return numValues.indexOf(minValue);
    }
    if (format === 'number' || format === 'area') {
      // For size, rooms, higher is better
      const numValues = values.map((v) => (typeof v === 'number' ? v : -1));
      const maxValue = Math.max(...numValues);
      return numValues.indexOf(maxValue);
    }
    return -1;
  };

  if (properties.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border border-border">
        <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t('noProperties')}
        </h3>
        <p className="text-gray-500 mb-6">{t('addPropertiesToCompare')}</p>
        <Link href="/properties">
          <Button>{t('browseProperties')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {t('comparing', { count: properties.length })}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer size={16} className="mr-2" />
            {t('print')}
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 size={16} className="mr-2" />
            {t('share')}
          </Button>
          <Button variant="ghost" size="sm" onClick={clearCompare}>
            {t('clearAll')}
          </Button>
        </div>
      </div>

      {/* Comparison Table */}
      <div
        ref={tableRef}
        className="bg-white rounded-xl border border-border overflow-hidden print:border-0"
      >
        {/* Sticky Header with Property Cards */}
        <div className="sticky top-0 z-10 bg-white border-b border-border">
          <div className="grid grid-cols-[200px_repeat(3,1fr)]">
            {/* Empty cell for row labels */}
            <div className="p-4 bg-gray-50 border-r border-border" />

            {/* Property Headers */}
            {properties.map((property, index) => (
              <div
                key={property.id}
                className={cn(
                  'relative p-4',
                  index < properties.length - 1 && 'border-r border-border'
                )}
              >
                {/* Remove Button */}
                <button
                  onClick={() => removeFromCompare(property.id)}
                  className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors print:hidden"
                >
                  <X size={16} />
                </button>

                {/* Property Image */}
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Property Info */}
                <Link
                  href={`/properties/${property.id}`}
                  className="block group"
                >
                  <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2 text-sm">
                    {property.title}
                  </h3>
                </Link>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin size={12} />
                  {property.location}
                </p>
                <p className="text-lg font-bold text-accent-gold mt-2">
                  {property.price}
                </p>
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: 3 - properties.length }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className={cn(
                  'p-4 bg-gray-50',
                  index < 2 - properties.length && 'border-r border-border'
                )}
              >
                <Link
                  href="/properties"
                  className="flex flex-col items-center justify-center h-full min-h-[200px] border-2 border-dashed border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                    <Building2 size={20} className="text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-500">
                    {t('addProperty')}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Sections */}
        {sections.map((section) => (
          <div key={section.id}>
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 border-b border-border hover:bg-gray-100 transition-colors"
            >
              <span className="font-semibold text-gray-800">
                {section.title}
              </span>
              {expandedSections[section.id] ? (
                <ChevronUp size={18} className="text-gray-400" />
              ) : (
                <ChevronDown size={18} className="text-gray-400" />
              )}
            </button>

            {/* Section Content */}
            {expandedSections[section.id] && (
              <div>
                {section.rows.map((row, rowIndex) => {
                  const values = properties.map((p) => row.getValue(p));
                  const bestIndex = getBestValue(values, row.format);

                  return (
                    <div
                      key={row.label}
                      className={cn(
                        'grid grid-cols-[200px_repeat(3,1fr)]',
                        rowIndex < section.rows.length - 1 &&
                          'border-b border-gray-100'
                      )}
                    >
                      {/* Row Label */}
                      <div className="p-4 bg-gray-50 border-r border-border flex items-center gap-2">
                        {row.icon && (
                          <span className="text-gray-400">{row.icon}</span>
                        )}
                        <span className="text-sm text-gray-600">
                          {row.label}
                        </span>
                      </div>

                      {/* Values */}
                      {properties.map((property, propIndex) => (
                        <div
                          key={property.id}
                          className={cn(
                            'p-4 text-center flex items-center justify-center',
                            propIndex < properties.length - 1 &&
                              'border-r border-gray-100',
                            bestIndex === propIndex &&
                              row.format !== 'boolean' &&
                              'bg-green-50'
                          )}
                        >
                          {formatValue(row.getValue(property), row.format)}
                        </div>
                      ))}

                      {/* Empty slots */}
                      {Array.from({ length: 3 - properties.length }).map(
                        (_, index) => (
                          <div
                            key={`empty-${index}`}
                            className={cn(
                              'p-4 bg-gray-50',
                              index < 2 - properties.length &&
                                'border-r border-gray-100'
                            )}
                          />
                        )
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area,
          .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
