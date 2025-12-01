'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from '@/i18n/routing';

// Fix for default marker icon in Next.js
const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface Property {
    id: string;
    title: string;
    location: string;
    price: string;
    image: string;
    lat?: number;
    lng?: number;
}

interface MapViewProps {
    properties: Property[];
}

// Component to update map center when properties change
function MapUpdater({ properties }: { properties: Property[] }) {
    const map = useMap();

    useEffect(() => {
        if (properties.length > 0 && properties[0].lat && properties[0].lng) {
            map.setView([properties[0].lat, properties[0].lng], 12);
        }
    }, [properties, map]);

    return null;
}

export default function MapView({ properties }: MapViewProps) {
    // Default center (Istanbul)
    const defaultCenter: [number, number] = [41.0082, 28.9784];

    // Filter properties with coordinates
    const validProperties = properties.filter(p => p.lat && p.lng);

    return (
        <div className="h-[600px] w-full rounded-lg overflow-hidden border border-border z-0 relative">
            <MapContainer
                center={defaultCenter}
                zoom={12}
                scrollWheelZoom={false}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapUpdater properties={validProperties} />

                {validProperties.map((property) => (
                    <Marker
                        key={property.id}
                        position={[property.lat!, property.lng!]}
                        icon={icon}
                    >
                        <Popup>
                            <div className="w-48">
                                <div
                                    className="h-24 w-full bg-cover bg-center rounded-t-md mb-2"
                                    style={{ backgroundImage: `url(${property.image})` }}
                                />
                                <h3 className="font-bold text-sm mb-1">{property.title}</h3>
                                <p className="text-xs text-gray-600 mb-1">{property.location}</p>
                                <p className="font-bold text-primary mb-2">{property.price}</p>
                                <Link
                                    href={`/properties/${property.id}`}
                                    className="block w-full text-center bg-primary text-white text-xs py-1 rounded hover:bg-primary-dark transition-colors"
                                >
                                    View Details
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
