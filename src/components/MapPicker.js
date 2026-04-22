'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

export default function MapPicker({ lat, lng, onChange }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    setMounted(true);
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mounted || !mapContainerRef.current || mapInstanceRef.current) return;

    // Default position (MSU Thailand if no lat/lng provided)
    const initialLat = lat ? parseFloat(lat) : 16.2464;
    const initialLng = lng ? parseFloat(lng) : 103.2523;

    // Create map instance
    const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], 15);
    mapInstanceRef.current = map;

    // Add TileLayer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Create custom icon
    const customIcon = L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    // Initial marker if lat/lng exists
    if (lat && lng) {
      markerRef.current = L.marker([initialLat, initialLng], { icon: customIcon }).addTo(map);
    }

    // Click event
    map.on('click', (e) => {
      const { lat: newLat, lng: newLng } = e.latlng;
      
      // Update or create marker
      if (markerRef.current) {
        markerRef.current.setLatLng(e.latlng);
      } else {
        markerRef.current = L.marker(e.latlng, { icon: customIcon }).addTo(map);
      }

      // Fly to position
      map.flyTo(e.latlng, map.getZoom());

      // Callback
      if (onChange) {
        onChange(newLat, newLng);
      }
    });

  }, [mounted, onChange, lat, lng]);

  // Handle external lat/lng changes (e.g. initial load from activity data)
  useEffect(() => {
    if (mapInstanceRef.current && lat && lng) {
      const newLat = parseFloat(lat);
      const newLng = parseFloat(lng);
      const currentCenter = mapInstanceRef.current.getCenter();
      
      if (currentCenter.lat !== newLat || currentCenter.lng !== newLng) {
        mapInstanceRef.current.setView([newLat, newLng]);
        
        if (markerRef.current) {
          markerRef.current.setLatLng([newLat, newLng]);
        } else {
          const customIcon = L.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          });
          markerRef.current = L.marker([newLat, newLng], { icon: customIcon }).addTo(mapInstanceRef.current);
        }
      }
    }
  }, [lat, lng]);

  if (!mounted) {
    return (
      <div className="h-[300px] bg-muted animate-pulse rounded-2xl flex items-center justify-center font-black uppercase tracking-widest text-[10px] text-muted-foreground">
        Loading Map Context...
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full rounded-2xl overflow-hidden border border-border shadow-inner relative z-0">
      <div ref={mapContainerRef} className="h-full w-full" />
      <div className="absolute bottom-2 left-2 z-[1000] bg-background/80 backdrop-blur-md px-3 py-1 rounded-full border border-border text-[9px] font-black uppercase tracking-widest text-muted-foreground shadow-lg pointer-events-none">
        Click on map to select location
      </div>
    </div>
  );
}
