'use client';

import { useState, useMemo } from 'react';
import { MapPin, List, Grid, ChevronLeft, ChevronRight, Bed, Bath, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdvancedMap, MapMarker } from './AdvancedMap';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  image: string;
  lat: number;
  lng: number;
}

interface PropertyMapViewProps {
  properties: Property[];
  apiKey: string;
  className?: string;
  onPropertyClick?: (property: Property) => void;
}

export function PropertyMapView({
  properties,
  apiKey,
  className,
  onPropertyClick,
}: PropertyMapViewProps) {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [view, setView] = useState<'split' | 'map' | 'list'>('split');
  const [listPage, setListPage] = useState(0);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(properties.length / itemsPerPage);

  // Convert properties to map markers
  const markers: MapMarker[] = useMemo(
    () =>
      properties.map((property) => ({
        id: property.id,
        lat: property.lat,
        lng: property.lng,
        title: property.title,
        type: 'property' as const,
        price: property.price,
        currency: property.currency,
        image: property.image,
        onClick: () => {
          setSelectedPropertyId(property.id);
          onPropertyClick?.(property);
        },
      })),
    [properties, onPropertyClick]
  );

  // Get current page properties
  const currentProperties = properties.slice(
    listPage * itemsPerPage,
    (listPage + 1) * itemsPerPage
  );

  // Handle marker click
  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedPropertyId(marker.id);
    const property = properties.find((p) => p.id === marker.id);
    if (property) {
      onPropertyClick?.(property);
    }
  };

  // Format price
  const formatPrice = (price: number, currency: string) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className={cn('flex flex-col h-[600px]', className)}>
      {/* View Toggle */}
      <div className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-2">
        <p className="text-sm text-gray-600">
          {properties.length} properties found
        </p>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setView('split')}
            className={cn(
              'p-2 rounded-md transition-colors',
              view === 'split' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
            )}
            aria-label="Split view"
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setView('map')}
            className={cn(
              'p-2 rounded-md transition-colors',
              view === 'map' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
            )}
            aria-label="Map view"
          >
            <MapPin size={18} />
          </button>
          <button
            onClick={() => setView('list')}
            className={cn(
              'p-2 rounded-md transition-colors',
              view === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
            )}
            aria-label="List view"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Property List */}
        {(view === 'split' || view === 'list') && (
          <div
            className={cn(
              'bg-white border-r border-gray-200 flex flex-col',
              view === 'list' ? 'w-full' : 'w-80 lg:w-96'
            )}
          >
            {/* Property Cards */}
            <div className="flex-1 overflow-y-auto">
              {currentProperties.map((property) => (
                <div
                  key={property.id}
                  className={cn(
                    'p-4 border-b border-gray-100 cursor-pointer transition-colors',
                    selectedPropertyId === property.id
                      ? 'bg-primary/5 border-l-4 border-l-primary'
                      : 'hover:bg-gray-50'
                  )}
                  onClick={() => {
                    setSelectedPropertyId(property.id);
                    onPropertyClick?.(property);
                  }}
                >
                  <div className="flex gap-3">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-24 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {property.title}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mb-1">
                        <MapPin size={12} />
                        {property.location}
                      </p>
                      <p className="font-bold text-primary">
                        {formatPrice(property.price, property.currency)}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Bed size={12} /> {property.bedrooms}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath size={12} /> {property.bathrooms}
                        </span>
                        <span className="flex items-center gap-1">
                          <Square size={12} /> {property.size}m²
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-3 border-t border-gray-200">
                <button
                  onClick={() => setListPage((p) => Math.max(0, p - 1))}
                  disabled={listPage === 0}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-sm text-gray-500">
                  Page {listPage + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setListPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={listPage === totalPages - 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Map */}
        {(view === 'split' || view === 'map') && (
          <div className="flex-1">
            <AdvancedMap
              apiKey={apiKey}
              markers={markers}
              onMarkerClick={handleMarkerClick}
              height="100%"
              showControls={true}
              enableDirections={true}
              enableFullscreen={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Nearby Places component
interface NearbyPlace {
  id: string;
  name: string;
  type: string;
  distance: string;
  lat: number;
  lng: number;
}

interface NearbyPlacesMapProps {
  propertyLat: number;
  propertyLng: number;
  propertyTitle: string;
  nearbyPlaces: NearbyPlace[];
  apiKey: string;
  className?: string;
}

export function NearbyPlacesMap({
  propertyLat,
  propertyLng,
  propertyTitle,
  nearbyPlaces,
  apiKey,
  className,
}: NearbyPlacesMapProps) {
  const markers: MapMarker[] = [
    {
      id: 'property',
      lat: propertyLat,
      lng: propertyLng,
      title: propertyTitle,
      type: 'property',
    },
    ...nearbyPlaces.map((place) => ({
      id: place.id,
      lat: place.lat,
      lng: place.lng,
      title: `${place.name} (${place.distance})`,
      type: 'amenity' as const,
    })),
  ];

  const placeTypeIcons: Record<string, string> = {
    school: '🏫',
    hospital: '🏥',
    restaurant: '🍽️',
    shopping: '🛒',
    park: '🌳',
    transport: '🚇',
    bank: '🏦',
    gym: '💪',
  };

  return (
    <div className={cn('rounded-xl overflow-hidden', className)}>
      <AdvancedMap
        apiKey={apiKey}
        markers={markers}
        height="400px"
        showControls={true}
        enableDirections={true}
      />

      {/* Nearby Places Legend */}
      <div className="bg-white p-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Nearby Amenities</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {nearbyPlaces.map((place) => (
            <div
              key={place.id}
              className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-sm"
            >
              <span>{placeTypeIcons[place.type] || '📍'}</span>
              <div className="truncate">
                <p className="font-medium text-gray-900 truncate">{place.name}</p>
                <p className="text-xs text-gray-500">{place.distance}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PropertyMapView;
