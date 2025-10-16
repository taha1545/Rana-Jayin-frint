'use client';

import { useEffect, useRef, useState } from 'react';
import { createServiceIcon, createMemberIcon } from './MapIcons';
import { getStatusColor, getMemberStatusColor, formatDistance } from '@/utils/mapHelpers';

const MapComponent = ({ services, members, onMarkerClick, userPosition }) => {
  //
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);
  const [leaflet, setLeaflet] = useState(null);
  // 
  useEffect(() => {
    let mounted = true;
    //
    const initializeMap = async () => {
      try {
        //
        const L = (await import('leaflet')).default;
        await import('leaflet/dist/leaflet.css');
        // 
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
        });

        if (!mounted) return;
        // 
        if (mapRef.current && mapRef.current._leaflet_id) {
          delete mapRef.current._leaflet_id;
        }
        // 
        const map = L.map(mapRef.current).setView([36.7538, 3.0588], 7);
        // 
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);
        //
        mapInstanceRef.current = map;
        setLeaflet(L);
        // 
        map.on('click', () => {
          map.closePopup();
        });
        //
      } catch (error) {
        console.error('Failed to initialize map:', error);
      }
    };
    //
    initializeMap();
    //
    return () => {
      mounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 
  useEffect(() => {
    if (!mapInstanceRef.current || !leaflet || !userPosition) return;
    const L = leaflet;
    // 
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }
    // 
    const userIcon = L.divIcon({
      className: 'user-location-marker',
      html: `
        <div style="
          background-color: #DC2626;
          border: 3px solid white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          animation: pulse 2s infinite;
        ">
          <div style="
            background-color: white;
            width: 6px;
            height: 6px;
            border-radius: 50%;
          "></div>
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
    userMarkerRef.current = L.marker([userPosition.latitude, userPosition.longitude], {
      icon: userIcon,
      zIndexOffset: 1000
    }).addTo(mapInstanceRef.current);
    userMarkerRef.current.bindPopup(`
      <div style="text-align: center; padding: 8px; min-width: 160px;">
        <strong>📍 Your Location</strong>
        <div style="font-size: 12px; color: #666; margin-top: 4px;">
          Latitude: ${userPosition.latitude.toFixed(5)}<br>
          Longitude: ${userPosition.longitude.toFixed(5)}
        </div>
      </div>
    `);
    // 
    mapInstanceRef.current.setView([userPosition.latitude, userPosition.longitude], 13);
  }, [userPosition, leaflet]);
  // 
  useEffect(() => {
    if (!mapInstanceRef.current || !leaflet) return;
    const L = leaflet;
    // 
    markersRef.current.forEach(marker => {
      if (marker && marker.remove) marker.remove();
    });
    markersRef.current = [];
    // 
    services.forEach(service => {
      const icon = createServiceIcon(service.type, service.status, L);
      const marker = L.marker(service.location, { icon })
        .addTo(mapInstanceRef.current);

      const popupContent = `
        <div style="min-width: 280px; padding: 4px;">
          <div style="display: flex; align-items: center; margin-bottom: 12px;">
            <img src="${service.storeImage || '/images/default-store.jpg'}" 
                 alt="${service.storeName}" 
                 style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover; margin-right: 12px;">
            <div style="flex: 1;">
              <strong style="font-size: 16px; display: block; margin-bottom: 4px;">${service.storeName}</strong>
              <div style="color: #666; font-size: 14px;">${service.title}</div>
            </div>
          </div>
          
          <div style="margin-bottom: 12px; space-y-2">
            <div style="display: flex; align-items: center; margin-bottom: 6px;">
              <span style="color: #F59E0B; margin-right: 4px;">★</span>
              <span style="font-weight: 500;">${service.rating}</span>
              <span style="color: #666; margin-left: 8px; font-size: 13px;">(${service.reviewCount} reviews)</span>
            </div>
            
            <div style="color: #666; font-size: 14px; margin-bottom: 4px;">
              <strong>Provider:</strong> ${service.member.name}
            </div>
            
            <div style="color: #666; font-size: 14px; margin-bottom: 4px;">
              <strong>Status:</strong> 
              <span style="color: ${getStatusColor(service.status)}; font-weight: 500; margin-left: 4px;">
                ${service.status.charAt(0).toUpperCase() + service.status.slice(1)}
              </span>
            </div>
            
            <div style="color: #666; font-size: 14px; margin-bottom: 4px;">
              <strong>Phone:</strong> ${service.phone}
            </div>
            
            ${service.distanceKm ? `
            <div style="color: #666; font-size: 14px;">
              <strong>Distance:</strong> ${formatDistance(service.distanceKm)}
            </div>
            ` : ''}
          </div>
          
          <div style="display: flex; gap: 8px; margin-bottom: 8px;">
            <button onclick="window.open('tel:${service.phone}', '_self')" 
                    style="background-color: #10B981; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 13px; flex: 1;">
              📞 Call
            </button>
            <button onclick="window.open('https://wa.me/${service.phone.replace('+', '')}?text=Hello, I need ${service.title} service', '_blank')"
                    style="background-color: #25D366; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 13px; flex: 1;">
              💬 WhatsApp
            </button>
          </div>
          
          <button onclick="this.dispatchEvent(new CustomEvent('requestService', { detail: ${JSON.stringify(service).replace(/"/g, '&quot;')} }))" 
                  style="background-color: #0394A1; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; width: 100%;">
            🛠️ Request Service
          </button>
        </div>
      `;
      marker.bindPopup(popupContent);
      //
      marker.on('popupopen', () => {
        const popupElement = marker.getPopup().getElement();
        const requestButton = popupElement?.querySelector('button[onclick*="requestService"]');
        if (requestButton) {
          const handleServiceRequest = () => {
            onMarkerClick(service);
          };
          requestButton.addEventListener('requestService', handleServiceRequest);
          //
          marker.on('popupclose', () => {
            requestButton.removeEventListener('requestService', handleServiceRequest);
          });
        }
      });

      marker.on('click', () => {
        onMarkerClick(service);
      });

      markersRef.current.push(marker);
    });
    // 
    members.forEach(member => {
      const icon = createMemberIcon(member.status, L);
      const marker = L.marker(member.location, { icon })
        .addTo(mapInstanceRef.current);

      const popupContent = `
        <div style="min-width: 240px; padding: 4px;">
          <div style="display: flex; align-items: center; margin-bottom: 12px;">
            <img src="${member.avatar || '/images/default-avatar.jpg'}" 
                 alt="${member.name}" 
                 style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; margin-right: 12px;">
            <div>
              <strong style="font-size: 16px;">${member.name}</strong>
              <div style="color: #666; font-size: 14px; margin-top: 4px;">Service Provider</div>
            </div>
          </div>
          
          <div style="margin-bottom: 8px;">
            <div style="display: flex; align-items: center; margin-bottom: 6px;">
              <span style="color: #F59E0B; margin-right: 4px;">★</span>
              <span style="font-weight: 500;">${member.rating}</span>
            </div>
            
            <div style="color: #666; font-size: 14px; margin-bottom: 4px;">
              <strong>Completed Jobs:</strong> ${member.completedJobs}
            </div>
            
            <div style="color: #666; font-size: 14px; margin-bottom: 4px;">
              <strong>Status:</strong> 
              <span style="color: ${getMemberStatusColor(member.status)}; font-weight: 500; margin-left: 4px;">
                ${member.status.charAt(0).toUpperCase() + member.status.slice(1)}
              </span>
            </div>
            
            <div style="color: #666; font-size: 14px;">
              <strong>Services:</strong> ${member.services.join(', ')}
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      markersRef.current.push(marker);
    });
    // 
    if (markersRef.current.length > 0 || userMarkerRef.current) {
      try {
        const allMarkers = [...markersRef.current];
        if (userMarkerRef.current) {
          allMarkers.push(userMarkerRef.current);
        }
        const group = L.featureGroup(allMarkers);
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
      } catch (error) {
        console.warn('Could not fit map bounds:', error);
      }
    }

  }, [services, members, onMarkerClick, leaflet]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full"
      style={{ background: '#f8f9fa' }}
    />
  );
};

export default MapComponent;