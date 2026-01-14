'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  Car,
  Train,
  Footprints,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  type?: 'property' | 'amenity' | 'poi';
  icon?: string;
  price?: number;
  currency?: string;
  image?: string;
  onClick?: () => void;
}

// Map style type (compatible with Google Maps)
export interface MapTypeStyle {
  featureType?: string;
  elementType?: string;
  stylers: Array<{ [key: string]: string | number | boolean }>;
}

export interface MapConfig {
  center: { lat: number; lng: number };
  zoom: number;
  mapTypeId?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  styles?: MapTypeStyle[];
}

interface AdvancedMapProps {
  apiKey: string;
  markers?: MapMarker[];
  config?: Partial<MapConfig>;
  showControls?: boolean;
  enableClustering?: boolean;
  enableDirections?: boolean;
  enableStreetView?: boolean;
  enableFullscreen?: boolean;
  className?: string;
  height?: string;
  onMarkerClick?: (marker: MapMarker) => void;
  onMapClick?: (coords: { lat: number; lng: number }) => void;
}

// Default Istanbul center
const defaultConfig: MapConfig = {
  center: { lat: 41.0082, lng: 28.9784 },
  zoom: 12,
  mapTypeId: 'roadmap',
};

// Luxury real estate map styles
const luxuryMapStyles: MapTypeStyle[] = [
  {
    featureType: 'all',
    elementType: 'geometry',
    stylers: [{ color: '#f5f5f5' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#c9c9c9' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9e9e9e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#e5e5e5' }],
  },
  {
    featureType: 'poi.business',
    stylers: [{ visibility: 'off' }],
  },
];

// Map component with fallback for when Google Maps is not loaded
export function AdvancedMap({
  apiKey,
  markers = [],
  config = {},
  showControls = true,
  enableClustering = true,
  enableDirections = true,
  enableStreetView = false,
  enableFullscreen = true,
  className,
  height = '500px',
  onMarkerClick,
  onMapClick,
}: AdvancedMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [map, setMap] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [mapType, setMapType] = useState<string>(config.mapTypeId || 'roadmap');
  const [directionsMode, setDirectionsMode] = useState<'DRIVING' | 'TRANSIT' | 'WALKING' | null>(null);

  const finalConfig = { ...defaultConfig, ...config };

  // Get google maps from window
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getGoogleMaps = (): any => (window as any).google?.maps;

  // Load Google Maps script
  useEffect(() => {
    if (typeof window === 'undefined' || !apiKey) return;

    // Check if already loaded
    if (getGoogleMaps()) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => console.error('Failed to load Google Maps');
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, [apiKey]);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || map) return;

    const googleMaps = getGoogleMaps();
    if (!googleMaps) return;

    const newMap = new googleMaps.Map(mapRef.current, {
      center: finalConfig.center,
      zoom: finalConfig.zoom,
      mapTypeId: finalConfig.mapTypeId,
      styles: finalConfig.styles || luxuryMapStyles,
      disableDefaultUI: true,
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: enableStreetView,
      fullscreenControl: false,
    });

    // Map click handler
    if (onMapClick) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      newMap.addListener('click', (e: any) => {
        if (e.latLng) {
          onMapClick({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        }
      });
    }

    setMap(newMap);
  }, [isLoaded, finalConfig, enableStreetView, onMapClick]);

  // Add markers
  useEffect(() => {
    if (!map || !markers.length) return;

    const googleMaps = getGoogleMaps();
    if (!googleMaps) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapMarkers: any[] = [];

    markers.forEach((marker) => {
      const mapMarker = new googleMaps.Marker({
        position: { lat: marker.lat, lng: marker.lng },
        map,
        title: marker.title,
        icon: marker.type === 'property'
          ? {
              path: googleMaps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#1a365d',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }
          : undefined,
      });

      mapMarker.addListener('click', () => {
        setSelectedMarker(marker);
        onMarkerClick?.(marker);
      });

      mapMarkers.push(mapMarker);
    });

    // Fit bounds to show all markers
    if (markers.length > 1) {
      const bounds = new googleMaps.LatLngBounds();
      markers.forEach((m) => bounds.extend({ lat: m.lat, lng: m.lng }));
      map.fitBounds(bounds, { padding: 50 });
    }

    return () => {
      mapMarkers.forEach((m) => m.setMap(null));
    };
  }, [map, markers, onMarkerClick]);

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    if (map) map.setZoom((map.getZoom() || 12) + 1);
  }, [map]);

  const handleZoomOut = useCallback(() => {
    if (map) map.setZoom((map.getZoom() || 12) - 1);
  }, [map]);

  // Map type toggle
  const handleMapTypeChange = useCallback(
    (type: string) => {
      if (map) {
        map.setMapTypeId(type);
        setMapType(type);
      }
    },
    [map]
  );

  // Fullscreen toggle
  const handleFullscreenToggle = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  // Get directions
  const handleGetDirections = useCallback(
    (mode: 'DRIVING' | 'TRANSIT' | 'WALKING') => {
      if (!selectedMarker) return;

      const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedMarker.lat},${selectedMarker.lng}&travelmode=${mode.toLowerCase()}`;
      window.open(url, '_blank');
      setDirectionsMode(null);
    },
    [selectedMarker]
  );

  // Fallback for no API key
  if (!apiKey) {
    return (
      <div
        className={cn(
          'bg-gray-100 rounded-xl flex items-center justify-center',
          className
        )}
        style={{ height }}
      >
        <div className="text-center p-8">
          <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Google Maps API key required</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative rounded-xl overflow-hidden',
        isFullscreen && 'fixed inset-0 z-50 rounded-none',
        className
      )}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Loading State */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-500">Loading map...</p>
          </div>
        </div>
      )}

      {/* Controls */}
      {showControls && isLoaded && (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {/* Zoom Controls */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-gray-100 transition-colors block"
              aria-label="Zoom in"
            >
              <ZoomIn size={20} />
            </button>
            <div className="h-px bg-gray-200" />
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-gray-100 transition-colors block"
              aria-label="Zoom out"
            >
              <ZoomOut size={20} />
            </button>
          </div>

          {/* Map Type Toggle */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => handleMapTypeChange(mapType === 'roadmap' ? 'satellite' : 'roadmap')}
              className="p-2 hover:bg-gray-100 transition-colors"
              aria-label="Toggle map type"
            >
              <Layers size={20} />
            </button>
          </div>

          {/* Fullscreen Toggle */}
          {enableFullscreen && (
            <button
              onClick={handleFullscreenToggle}
              className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <X size={20} /> : <Maximize2 size={20} />}
            </button>
          )}
        </div>
      )}

      {/* Selected Marker Info */}
      {selectedMarker && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white rounded-xl shadow-xl overflow-hidden animate-slide-up">
          {selectedMarker.image && (
            <img
              src={selectedMarker.image}
              alt={selectedMarker.title}
              className="w-full h-32 object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-1">{selectedMarker.title}</h3>
            {selectedMarker.price && (
              <p className="text-lg font-bold text-primary">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: selectedMarker.currency || 'EUR',
                  maximumFractionDigits: 0,
                }).format(selectedMarker.price)}
              </p>
            )}

            {/* Directions */}
            {enableDirections && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Get Directions</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleGetDirections('DRIVING')}
                    className="flex-1 flex items-center justify-center gap-1 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Car size={16} />
                    <span className="text-xs">Drive</span>
                  </button>
                  <button
                    onClick={() => handleGetDirections('TRANSIT')}
                    className="flex-1 flex items-center justify-center gap-1 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Train size={16} />
                    <span className="text-xs">Transit</span>
                  </button>
                  <button
                    onClick={() => handleGetDirections('WALKING')}
                    className="flex-1 flex items-center justify-center gap-1 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Footprints size={16} />
                    <span className="text-xs">Walk</span>
                  </button>
                </div>
              </div>
            )}

            {/* View Property button */}
            {selectedMarker.onClick && (
              <button
                onClick={selectedMarker.onClick}
                className="w-full mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
              >
                View Property
              </button>
            )}

            {/* Close button */}
            <button
              onClick={() => setSelectedMarker(null)}
              className="absolute top-2 right-2 p-1 bg-white/90 rounded-full hover:bg-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Static map component for places where interactive map is not needed
interface StaticMapProps {
  lat: number;
  lng: number;
  zoom?: number;
  width?: number;
  height?: number;
  apiKey: string;
  marker?: boolean;
  className?: string;
}

export function StaticMap({
  lat,
  lng,
  zoom = 15,
  width = 600,
  height = 300,
  apiKey,
  marker = true,
  className,
}: StaticMapProps) {
  const src = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&scale=2${marker ? `&markers=color:red%7C${lat},${lng}` : ''}&key=${apiKey}`;

  return (
    <img
      src={src}
      alt="Location map"
      className={cn('rounded-lg', className)}
      width={width}
      height={height}
      loading="lazy"
    />
  );
}

// Embed map for simple iframe embedding
interface EmbedMapProps {
  query: string;
  apiKey: string;
  width?: string;
  height?: string;
  className?: string;
}

export function EmbedMap({
  query,
  apiKey,
  width = '100%',
  height = '400px',
  className,
}: EmbedMapProps) {
  const encodedQuery = encodeURIComponent(query);
  const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedQuery}`;

  return (
    <iframe
      src={src}
      width={width}
      height={height}
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={cn('rounded-lg', className)}
    />
  );
}

export default AdvancedMap;
