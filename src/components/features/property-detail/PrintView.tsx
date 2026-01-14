'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Printer, Bed, Bath, Ruler, MapPin, Calendar, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PropertyData {
  id: string;
  title: string;
  location: string;
  price: string;
  description: string;
  images: string[];
  beds: number;
  baths: number;
  size: number;
  type: 'sale' | 'rent';
  yearBuilt?: number;
  propertyType?: string;
  features?: string[];
  agent?: {
    name: string;
    phone: string;
    email: string;
  };
}

interface PrintViewProps {
  property: PropertyData;
}

export function PrintButton({ onClick }: { onClick: () => void }) {
  const t = useTranslations('PropertyDetail');

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="flex items-center gap-2"
    >
      <Printer size={16} />
      {t('print.button')}
    </Button>
  );
}

export function PrintView({ property }: PrintViewProps) {
  const t = useTranslations('PropertyDetail');
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  // Generate QR code URL
  const qrCodeUrl =
    typeof window !== 'undefined'
      ? `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(window.location.href)}`
      : '';

  return (
    <>
      {/* Print Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrint}
        className="flex items-center gap-2 print:hidden"
      >
        <Printer size={16} />
        {t('print.button')}
      </Button>

      {/* Print-Only Content */}
      <div
        ref={printRef}
        className="hidden print:block print:absolute print:inset-0 print:bg-white print:z-[9999]"
      >
        {/* Header with Logo */}
        <div className="flex items-center justify-between border-b-2 border-primary pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-serif text-primary">
              Maison d&apos;Orient
            </h1>
            <p className="text-sm text-gray-500">Luxury Real Estate Istanbul</p>
          </div>
          {qrCodeUrl && (
            <div className="text-center">
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="w-20 h-20 border border-gray-200"
              />
              <p className="text-[8px] text-gray-400 mt-1">Scan for online listing</p>
            </div>
          )}
        </div>

        {/* Property Title & Price */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {property.title}
          </h2>
          <div className="flex items-center justify-between mt-2">
            <p className="text-gray-600 flex items-center gap-1">
              <MapPin size={14} />
              {property.location}
            </p>
            <p className="text-xl font-bold text-primary">{property.price}</p>
          </div>
        </div>

        {/* Main Image */}
        {property.images[0] && (
          <div className="mb-6">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Key Specifications */}
        <div className="grid grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <Bed size={20} className="mx-auto text-primary mb-1" />
            <p className="text-lg font-semibold">{property.beds}</p>
            <p className="text-xs text-gray-500">{t('print.bedrooms')}</p>
          </div>
          <div className="text-center">
            <Bath size={20} className="mx-auto text-primary mb-1" />
            <p className="text-lg font-semibold">{property.baths}</p>
            <p className="text-xs text-gray-500">{t('print.bathrooms')}</p>
          </div>
          <div className="text-center">
            <Ruler size={20} className="mx-auto text-primary mb-1" />
            <p className="text-lg font-semibold">{property.size}</p>
            <p className="text-xs text-gray-500">m²</p>
          </div>
          <div className="text-center">
            <Calendar size={20} className="mx-auto text-primary mb-1" />
            <p className="text-lg font-semibold">
              {property.yearBuilt || 'N/A'}
            </p>
            <p className="text-xs text-gray-500">{t('print.yearBuilt')}</p>
          </div>
          <div className="text-center">
            <div className="w-5 h-5 mx-auto text-primary mb-1 flex items-center justify-center">
              <span className="text-xs font-bold">
                {property.type === 'sale' ? 'SALE' : 'RENT'}
              </span>
            </div>
            <p className="text-lg font-semibold capitalize">
              {property.propertyType || 'Property'}
            </p>
            <p className="text-xs text-gray-500">{t('print.type')}</p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
            {t('print.description')}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {property.description}
          </p>
        </div>

        {/* Features */}
        {property.features && property.features.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
              {t('print.features')}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {property.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <Check size={12} className="text-green-500" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Images Grid */}
        {property.images.length > 1 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
              {t('print.gallery')}
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {property.images.slice(1, 5).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${property.title} - ${index + 2}`}
                  className="w-full h-24 object-cover rounded"
                />
              ))}
            </div>
          </div>
        )}

        {/* Agent Contact */}
        {property.agent && (
          <div className="border-t border-gray-200 pt-4 mt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
              {t('print.contactAgent')}
            </h3>
            <div className="flex items-center gap-6">
              <div>
                <p className="font-medium text-gray-900">
                  {property.agent.name}
                </p>
                <p className="text-sm text-gray-500">Real Estate Consultant</p>
              </div>
              <div className="text-sm text-gray-600">
                <p>{property.agent.phone}</p>
                <p>{property.agent.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-200 pt-4 mt-8 text-center text-xs text-gray-400">
          <p>Maison d&apos;Orient | Meşrutiyet Caddesi No: 79A, Beyoğlu / İSTANBUL</p>
          <p>+90 532 461 05 74 | info@maison-dorient.com | www.maison-dorient.com</p>
          <p className="mt-2">
            Property ID: {property.id} | Generated on{' '}
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          /* Hide everything except print view */
          body > *:not(.print-container) {
            display: none !important;
          }

          /* Reset print margins */
          @page {
            margin: 1cm;
            size: A4;
          }

          /* Ensure colors print */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Show print view */
          .print\\:block {
            display: block !important;
            position: relative !important;
          }

          /* Hide non-print elements */
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
