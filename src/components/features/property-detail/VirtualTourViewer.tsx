'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Maximize2, Minimize2, Play, X, Rotate3D } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface VirtualTourViewerProps {
  tourUrl?: string;
  thumbnailUrl?: string;
  propertyTitle: string;
  className?: string;
}

export function VirtualTourViewer({
  tourUrl,
  thumbnailUrl,
  propertyTitle,
  className,
}: VirtualTourViewerProps) {
  const t = useTranslations('PropertyDetail');
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // If no tour URL, don't render
  if (!tourUrl) {
    return null;
  }

  // Check if it's a Matterport URL
  const isMatterport = tourUrl.includes('matterport.com');

  // Format the embed URL
  const getEmbedUrl = () => {
    if (isMatterport) {
      // Ensure it's in embed format
      if (tourUrl.includes('/show/')) {
        return tourUrl;
      }
      // Convert regular URL to embed URL
      const modelId = tourUrl.split('/').pop()?.split('?')[0];
      return `https://my.matterport.com/show/?m=${modelId}`;
    }
    return tourUrl;
  };

  const toggleFullscreen = () => {
    const element = document.getElementById('virtual-tour-container');
    if (!element) return;

    if (!isFullscreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <>
      {/* Thumbnail / Preview */}
      <div
        className={cn(
          'relative rounded-xl overflow-hidden bg-gray-100 cursor-pointer group',
          className
        )}
        onClick={() => setIsOpen(true)}
      >
        {/* Thumbnail Image */}
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={`Virtual tour of ${propertyTitle}`}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-64 bg-gradient-to-br from-primary/10 to-accent-gold/10 flex items-center justify-center">
            <Rotate3D size={64} className="text-primary/30" />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Play size={32} className="ml-1" />
            </div>
            <p className="font-medium text-lg">{t('virtualTour.title')}</p>
            <p className="text-sm text-white/70 mt-1">
              {t('virtualTour.clickToExplore')}
            </p>
          </div>
        </div>

        {/* 360 Badge */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-sm font-medium rounded-full flex items-center gap-1">
          <Rotate3D size={14} />
          360° Tour
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-black/80">
            <div className="flex items-center gap-3">
              <Rotate3D size={24} className="text-white" />
              <div>
                <h3 className="text-white font-medium">{propertyTitle}</h3>
                <p className="text-white/60 text-sm">{t('virtualTour.title')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleFullscreen}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize2 size={20} />
                ) : (
                  <Maximize2 size={20} />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Tour Container */}
          <div
            id="virtual-tour-container"
            className="flex-1 relative bg-gray-900"
          >
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="text-center text-white">
                  <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-white/70">{t('virtualTour.loading')}</p>
                </div>
              </div>
            )}

            {/* Tour iFrame */}
            <iframe
              src={getEmbedUrl()}
              title={`Virtual tour of ${propertyTitle}`}
              className="w-full h-full border-0"
              allowFullScreen
              allow="xr-spatial-tracking"
              onLoad={() => setIsLoading(false)}
            />
          </div>

          {/* Footer */}
          <div className="p-4 bg-black/80 text-center">
            <p className="text-white/50 text-sm">
              {t('virtualTour.instructions')}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
