'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

const UserLocationMap = ({ position }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        const initializeMap = async () => {
            try {
                const L = (await import('leaflet')).default;

                // 
                delete L.Icon.Default.prototype._getIconUrl;
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                });

                //
                if (!mapInstanceRef.current) {
                    mapInstanceRef.current = L.map(mapRef.current).setView(
                        [position.lat, position.lng],
                        15
                    );

                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '© OpenStreetMap contributors'
                    }).addTo(mapInstanceRef.current);

                    // 
                    const userIcon = L.divIcon({
                        className: 'user-marker',
                        html: `<div class="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg"></div>`,
                        iconSize: [16, 16],
                        iconAnchor: [8, 8]
                    });

                    markerRef.current = L.marker([position.lat, position.lng], {
                        icon: userIcon
                    }).addTo(mapInstanceRef.current);
                }

                // 
                if (markerRef.current) {
                    markerRef.current.setLatLng([position.lat, position.lng]);
                    mapInstanceRef.current.setView([position.lat, position.lng], 15);
                }
            } catch (error) {
                console.error('Error initializing map:', error);
            }
        };

        if (position?.lat && position?.lng) {
            initializeMap();
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [position]);

    if (!position?.lat || !position?.lng) {
        return <div className="h-full w-full flex items-center justify-center bg-muted">
            No location available
        </div>;
    }

    return <div ref={mapRef} className="h-full w-full" />;
};

export default UserLocationMap;