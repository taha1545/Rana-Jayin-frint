'use client';
import { useState, useEffect } from 'react';
import MapComponent from '@/components/map/MapComponent';

export default function MapPickerModal({ onClose, onSelect, initialCoords = null }) {
  const [tempCoords, setTempCoords] = useState(initialCoords);
  const [userPosition, setUserPosition] = useState(null);

  // 
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPosition({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => console.warn('Geolocation error:', err.message),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          width: '90%',
          maxWidth: '800px',
          height: '80vh',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Map */}
        <div style={{ flex: 1 }}>
          <MapComponent
            pickMode
            pickedLocation={tempCoords}
            userPosition={userPosition}
            onPickLocation={(coords) => setTempCoords(coords)}
          />
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            borderTop: '1px solid #eee',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: 'none',
              backgroundColor: '#ef4444',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>

          <button
            onClick={() => {
              if (tempCoords) onSelect(tempCoords);
            }}
            disabled={!tempCoords}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: 'none',
              backgroundColor: tempCoords ? '#2563EB' : '#9CA3AF',
              color: 'white',
              cursor: tempCoords ? 'pointer' : 'not-allowed',
            }}
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
}
