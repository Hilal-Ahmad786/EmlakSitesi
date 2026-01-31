'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ImageGallery } from '@/components/features/property-detail/ImageGallery';
import { PropertyInfo } from '@/components/features/property-detail/PropertyInfo';
import { MortgageCalculator } from '@/components/features/tools/MortgageCalculator';
import { ROICalculator } from '@/components/features/tools/ROICalculator';
import { SimilarProperties } from '@/components/features/property-detail/SimilarProperties';
import { ShareButtons } from '@/components/features/property-detail/ShareButtons';
import { PropertyVideo } from '@/components/features/property-detail/PropertyVideo';
import { VirtualTourViewer } from '@/components/features/property-detail/VirtualTourViewer';
import { DocumentRequest } from '@/components/features/property-detail/DocumentRequest';
import { PrintView } from '@/components/features/property-detail/PrintView';
import { AppointmentScheduler } from '@/components/features/appointment/AppointmentScheduler';
import { MapPin, Calculator, Calendar, FileText } from 'lucide-react';

interface PropertyData {
  id: string;
  title: string;
  description: string;
  location: string;
  address: string;
  price: string;
  priceNumber: number;
  currency: string;
  images: string[];
  specs: {
    beds: number;
    baths: number;
    size: number;
    type: string;
    status: string;
    built: number | null;
  };
  features: string[];
  virtualTourUrl: string;
  hasVirtualTour: boolean;
  videoUrl: string;
  isFeatured: boolean;
  isNew: boolean;
}

export function PropertyDetailClient({ property }: { property: PropertyData }) {
  const t = useTranslations('PropertyDetail');
  const [activeTab, setActiveTab] = useState<'mortgage' | 'roi'>('mortgage');
  const [showAppointment, setShowAppointment] = useState(false);
  const [showDocumentRequest, setShowDocumentRequest] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl text-primary mb-2">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-text-secondary">
                <MapPin size={18} />
                <span>{property.location}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                {property.price}
              </div>
              <div className="flex gap-2 mt-2 justify-end">
                <PrintView
                  property={{
                    id: property.id,
                    title: property.title,
                    location: property.location,
                    price: property.price,
                    description: property.description,
                    images: property.images,
                    beds: property.specs.beds,
                    baths: property.specs.baths,
                    size: property.specs.size,
                    type: property.specs.status === 'For Sale' ? 'sale' : 'rent',
                    yearBuilt: property.specs.built ?? undefined,
                    propertyType: property.specs.type,
                    features: property.features,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="mb-12">
          <ImageGallery images={property.images} />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <PropertyInfo
              specs={{ ...property.specs, built: property.specs.built ?? 0 }}
              features={property.features}
              description={property.description}
            />

            {/* Virtual Tour */}
            {property.hasVirtualTour && (
              <VirtualTourViewer
                tourUrl={property.virtualTourUrl}
                propertyTitle={property.title}
              />
            )}

            {property.videoUrl && (
              <PropertyVideo
                videoUrl={property.videoUrl}
                coverImage={property.images[0]}
              />
            )}

            <ShareButtons title={property.title} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Calculator Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
              <div className="flex border-b border-border">
                <button
                  onClick={() => setActiveTab('mortgage')}
                  className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                    activeTab === 'mortgage'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Calculator size={16} />
                  Mortgage
                </button>
                <button
                  onClick={() => setActiveTab('roi')}
                  className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                    activeTab === 'roi'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Calculator size={16} />
                  ROI
                </button>
              </div>
              <div className="p-4">
                {activeTab === 'mortgage' ? (
                  <MortgageCalculator propertyPrice={property.priceNumber} />
                ) : (
                  <ROICalculator initialPrice={property.priceNumber} />
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setShowAppointment(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent-gold text-white font-medium rounded-lg hover:bg-accent-gold/90 transition-colors"
              >
                <Calendar size={18} />
                Schedule Viewing
              </button>
              <button
                onClick={() => setShowDocumentRequest(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-primary text-primary font-medium rounded-lg hover:bg-primary/5 transition-colors"
              >
                <FileText size={18} />
                Request Documents
              </button>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        <SimilarProperties />
      </div>

      {/* Modals */}
      {showAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <AppointmentScheduler
              propertyId={property.id}
              propertyTitle={property.title}
              propertyImage={property.images[0]}
              propertyLocation={property.location}
              onClose={() => setShowAppointment(false)}
            />
          </div>
        </div>
      )}

      {showDocumentRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowDocumentRequest(false)}>
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowDocumentRequest(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="sr-only">Close</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <DocumentRequest
              propertyId={property.id}
              propertyTitle={property.title}
            />
          </div>
        </div>
      )}
    </div>
  );
}
