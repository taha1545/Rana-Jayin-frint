'use client';

import { useEffect, useRef } from 'react';
import { createServiceIcon } from './MapIcons';
import { getStatusColor, formatDistance } from '@/utils/mapHelpers';

const MapComponent = ({
  services = [],
  onMarkerClick = () => { },
  userPosition = null,
  focusTarget = null,
  pickMode = false,
  pickedLocation = null,
  onPickLocation = () => { },
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const LRef = useRef(null);
  const markersGroupRef = useRef(null);
  const userMarkerRef = useRef(null);
  const userInteractedRef = useRef(false);
  const hasCenteredOnUserRef = useRef(false);
  const markerIndexRef = useRef(new Map());
  const pickMarkerRef = useRef(null);

  // 
  useEffect(() => {
    let mounted = true;

    const initializeMap = async () => {
      try {
        const L = (await import('leaflet')).default;
        await import('leaflet/dist/leaflet.css');

        // Fix missing icon paths
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        if (!mounted) return;

        // Clean existing instance
        if (mapRef.current && mapRef.current._leaflet_id) {
          delete mapRef.current._leaflet_id;
        }

        // Initialize map
        const map = L.map(mapRef.current, {
          center: [36.7538, 3.0588],
          zoom: 7,
          zoomControl: false,
          minZoom: 3,
          maxZoom: 19,
          wheelDebounceTime: 40,
          wheelPxPerZoomLevel: 80,
          zoomAnimation: true,
          fadeAnimation: true,
          inertia: true,
          worldCopyJump: true,
          preferCanvas: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        mapInstanceRef.current = map;
        LRef.current = L;

        markersGroupRef.current = L.layerGroup().addTo(map);

        map.on('click', () => map.closePopup());
        map.on('movestart zoomstart', () => {
          userInteractedRef.current = true;
        });
      } catch (error) {
        console.error('Failed to initialize map:', error);
      }
    };

    initializeMap();

    return () => {
      mounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle user position marker
  useEffect(() => {
    if (!mapInstanceRef.current || !LRef.current || !userPosition) return;
    const L = LRef.current;

    if (userMarkerRef.current) userMarkerRef.current.remove();

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
      iconAnchor: [10, 10],
    });

    userMarkerRef.current = L.marker(
      [userPosition.latitude, userPosition.longitude],
      { icon: userIcon, zIndexOffset: 1000 }
    ).addTo(mapInstanceRef.current);

    userMarkerRef.current.bindPopup(`
      <div style="text-align: center; padding: 8px; min-width: 160px;">
        <strong>📍 Your Location</strong>
        <div style="font-size: 12px; color: #666; margin-top: 4px;">
          Latitude: ${userPosition.latitude.toFixed(5)}<br>
          Longitude: ${userPosition.longitude.toFixed(5)}
        </div>
      </div>
    `);

    if (!hasCenteredOnUserRef.current) {
      mapInstanceRef.current.flyTo(
        [userPosition.latitude, userPosition.longitude],
        13,
        { duration: 0.8 }
      );
      hasCenteredOnUserRef.current = true;
    }
  }, [userPosition]);

  // Pick mode: click to select a location
  useEffect(() => {
    if (!mapInstanceRef.current || !LRef.current) return;
    const map = mapInstanceRef.current;
    const handler = (e) => {
      if (!pickMode) return;
      const { lat, lng } = e.latlng;
      if (pickMarkerRef.current) {
        pickMarkerRef.current.setLatLng([lat, lng]);
      } else {
        pickMarkerRef.current = LRef.current.marker([lat, lng]).addTo(map);
      }
      onPickLocation({ lat, lng });
    };
    map.on('click', handler);
    map.getContainer().style.cursor = pickMode ? 'crosshair' : '';
    return () => {
      map.off('click', handler);
      map.getContainer().style.cursor = '';
    };
  }, [pickMode, onPickLocation]);

  // 
  useEffect(() => {
    if (!pickMode || !pickedLocation || !mapInstanceRef.current || !LRef.current) return;
    const map = mapInstanceRef.current;
    const lat = pickedLocation.lat ?? pickedLocation[0];
    const lng = pickedLocation.lng ?? pickedLocation[1];
    if (pickMarkerRef.current) {
      pickMarkerRef.current.setLatLng([lat, lng]);
    } else {
      pickMarkerRef.current = LRef.current.marker([lat, lng]).addTo(map);
    }
  }, [pickedLocation, pickMode]);

  // 
  useEffect(() => {
    if (!mapInstanceRef.current || !LRef.current) return;

    const L = LRef.current;
    const safeServices = Array.isArray(services) ? services : [];

    if (markersGroupRef.current) {
      markersGroupRef.current.clearLayers();
    }
    markerIndexRef.current.clear?.();

    // Add service markers
    safeServices.forEach((service) => {
      if (!service.location) return;

      const icon = createServiceIcon(service.type, service.status, L);
      const marker = L.marker(service.location, { icon }).addTo(
        markersGroupRef.current
      );

      const originParam = userPosition ? `&origin=${userPosition.latitude},${userPosition.longitude}` : '';
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${service.location[0]},${service.location[1]}${originParam}`;

      const popupContent = `
        <div style="min-width: 280px; padding: 4px;">
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <img src="${service.storeImage || '/images/default-store.jpg'}" 
                 alt="${service.storeName}" 
                 style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover; margin-right: 10px;">
            <div>
              <strong style="font-size: 15px;">${service.storeName}</strong><br>
              <span style="font-size: 13px; color: #666;">${service.title}</span>
            </div>
          </div>

          <div style="font-size: 13px; color: #444;">
            <strong>Status:</strong> 
            <span style="color: ${getStatusColor(service.status)};">
              ${service.status}
            </span><br>
            <strong>Phone:</strong> ${service.phone}<br>
            ${service.distanceKm
          ? `<strong>Distance:</strong> ${formatDistance(service.distanceKm)}`
          : ''
        }
          </div>

          <div style="margin-top: 10px; display: flex; gap: 8px;">
            <button 
              onclick="window.open('tel:${service.phone}', '_self')" 
              style="background:#10B981; color:white; border:none; padding:6px 10px; border-radius:5px; cursor:pointer; font-size:12px; flex:1;">
              📞 Call
            </button>
            <button 
              onclick="window.open('${directionsUrl}', '_blank')" 
              style="background:#2563EB; color:white; border:none; padding:6px 10px; border-radius:5px; cursor:pointer; font-size:12px; flex:1;">
              🧭 Directions
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => onMarkerClick(service));
      if (service.id !== undefined && service.id !== null) {
        markerIndexRef.current.set(`s_${service.id}`, marker);
      }
    });

    // 
    const layers = markersGroupRef.current?.getLayers?.() || [];
    if ((layers.length > 0 || userMarkerRef.current) && !userInteractedRef.current) {
      try {
        const allLayers = [...layers];
        if (userMarkerRef.current) allLayers.push(userMarkerRef.current);
        const group = L.featureGroup(allLayers);
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.12), {
          maxZoom: 15,
          animate: true
        });
      } catch (error) {
        console.warn('Could not fit map bounds:', error);
      }
    }
  }, [services, onMarkerClick, userPosition]);

  //
  useEffect(() => {
    if (!mapInstanceRef.current || !LRef.current || !focusTarget) return;
    const { type, id, location } = focusTarget;
    let marker = null;
    if (type && id !== undefined && id !== null) {
      const key = `s_${id}`;
      marker = markerIndexRef.current.get(key) || null;
    }
    let targetLatLng = marker?.getLatLng?.() || null;
    if (!targetLatLng && location) {
      if (Array.isArray(location)) {
        targetLatLng = { lat: location[0], lng: location[1] };
      } else if (typeof location === 'object' && location.lat != null && location.lng != null) {
        targetLatLng = { lat: location.lat, lng: location.lng };
      }
    }
    if (!targetLatLng) return;
    userInteractedRef.current = true;
    mapInstanceRef.current.flyTo([targetLatLng.lat ?? targetLatLng[0], targetLatLng.lng ?? targetLatLng[1]], 15, { duration: 0.6 });
    if (marker?.openPopup) {
      setTimeout(() => marker.openPopup(), 650);
    }
  }, [focusTarget]);

  const fitToData = () => {
    if (!mapInstanceRef.current || !LRef.current) return;
    const layers = markersGroupRef.current?.getLayers?.() || [];
    if (layers.length === 0 && !userMarkerRef.current) return;
    const L = LRef.current;
    const allLayers = [...layers];
    if (userMarkerRef.current) allLayers.push(userMarkerRef.current);
    const group = L.featureGroup(allLayers);
    mapInstanceRef.current.fitBounds(group.getBounds().pad(0.12), {
      maxZoom: 15,
      animate: true
    });
  };

  const goToUser = () => {
    if (!mapInstanceRef.current || !userPosition) return;
    userInteractedRef.current = true;
    mapInstanceRef.current.flyTo(
      [userPosition.latitude, userPosition.longitude],
      Math.max(mapInstanceRef.current.getZoom(), 13),
      { duration: 0.8 }
    );
  };

  return (
    <div
      className="w-full h-full relative"
      style={{ background: '#f8f9fa', borderRadius: '12px', overflow: 'hidden', zIndex: 0 }}
    >
      <div ref={mapRef} className="w-full h-full" />
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          display: 'flex',
          gap: 8,
          zIndex: 10,
        }}
      >
        <button
          onClick={fitToData}
          style={{
            background: '#111827',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '8px 10px',
            fontSize: 12,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
          }}
        >
          Fit
        </button>
        <button
          onClick={goToUser}
          disabled={!userPosition}
          style={{
            background: userPosition ? '#2563EB' : '#9CA3AF',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '8px 10px',
            fontSize: 12,
            cursor: userPosition ? 'pointer' : 'not-allowed',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
          }}
        >
          Locate
        </button>
      </div>
    </div>
  );
};

export default MapComponent;
