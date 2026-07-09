import React, { useEffect, useRef, useState } from 'react';

interface MapComponentProps {
  pickupCoords?: [number, number] | null;
  dropCoords?: [number, number] | null;
  routeCoords?: [number, number][]; // Expected in [lat, lng] format
  carCoords?: [number, number] | null;
  interactive?: boolean;
}

let leafletPromise: Promise<void> | null = null;
const loadLeaflet = (): Promise<void> => {
  if (leafletPromise) return leafletPromise;

  leafletPromise = new Promise((resolve) => {
    // Add CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.id = 'leaflet-css';
    document.head.appendChild(link);

    // Add Script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.id = 'leaflet-js';
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
  return leafletPromise;
};

export const MapComponent: React.FC<MapComponentProps> = ({
  pickupCoords,
  dropCoords,
  routeCoords = [],
  carCoords,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Markers and Polylines references
  const pickupMarkerRef = useRef<any>(null);
  const dropMarkerRef = useRef<any>(null);
  const carMarkerRef = useRef<any>(null);
  const routeLineRef = useRef<any>(null);

  useEffect(() => {
    loadLeaflet().then(() => {
      setLeafletLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!leafletLoaded || !containerRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    // Initialize Map if not already created
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current, {
        zoomControl: interactive,
        dragging: interactive,
        touchZoom: interactive,
        scrollWheelZoom: interactive,
        doubleClickZoom: interactive,
        attributionControl: false
      }).setView([17.385044, 78.486671], 12); // Default to Hyderabad Center

      // Clean, premium styled map tiles (CartoDB Positron / Light)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    // Define custom styled icons
    const pickupIcon = L.divIcon({
      html: `<div class="w-8 h-8 rounded-full bg-[#FFC107] border-4 border-white shadow-xl flex items-center justify-center font-display font-black text-sm text-[#121212]">P</div>`,
      className: 'custom-map-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const dropIcon = L.divIcon({
      html: `<div class="w-8 h-8 rounded-full bg-[#EF4444] border-4 border-white shadow-xl flex items-center justify-center font-display font-black text-sm text-white">D</div>`,
      className: 'custom-map-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const carIcon = L.divIcon({
      html: `<div class="w-9 h-9 rounded-full bg-[#121212] border-2 border-[#FFC107] shadow-2xl flex items-center justify-center text-[#FFC107]">
        <svg class="w-5 h-5 fill-current transform rotate-45 animate-pulse" viewBox="0 0 24 24">
          <path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z"/>
        </svg>
      </div>`,
      className: 'custom-map-marker-car',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    // Update Pickup Marker
    if (pickupCoords) {
      if (pickupMarkerRef.current) {
        pickupMarkerRef.current.setLatLng(pickupCoords);
      } else {
        pickupMarkerRef.current = L.marker(pickupCoords, { icon: pickupIcon }).addTo(map);
      }
    } else if (pickupMarkerRef.current) {
      map.removeLayer(pickupMarkerRef.current);
      pickupMarkerRef.current = null;
    }

    // Update Drop Marker
    if (dropCoords) {
      if (dropMarkerRef.current) {
        dropMarkerRef.current.setLatLng(dropCoords);
      } else {
        dropMarkerRef.current = L.marker(dropCoords, { icon: dropIcon }).addTo(map);
      }
    } else if (dropMarkerRef.current) {
      map.removeLayer(dropMarkerRef.current);
      dropMarkerRef.current = null;
    }

    // Update Car Marker
    if (carCoords) {
      if (carMarkerRef.current) {
        carMarkerRef.current.setLatLng(carCoords);
      } else {
        carMarkerRef.current = L.marker(carCoords, { icon: carIcon }).addTo(map);
      }
    } else if (carMarkerRef.current) {
      map.removeLayer(carMarkerRef.current);
      carMarkerRef.current = null;
    }

    // Update Route Polyline
    if (routeCoords && routeCoords.length > 0) {
      if (routeLineRef.current) {
        routeLineRef.current.setLatLngs(routeCoords);
      } else {
        routeLineRef.current = L.polyline(routeCoords, {
          color: '#121212',
          weight: 4.5,
          opacity: 0.85,
          dashArray: '2, 6',
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);
      }
    } else if (routeLineRef.current) {
      map.removeLayer(routeLineRef.current);
      routeLineRef.current = null;
    }

    // Adjust viewport bounds to fit markers and lines
    const group: any[] = [];
    if (pickupMarkerRef.current) group.push(pickupMarkerRef.current.getLatLng());
    if (dropMarkerRef.current) group.push(dropMarkerRef.current.getLatLng());
    if (carMarkerRef.current) group.push(carMarkerRef.current.getLatLng());
    if (routeLineRef.current) {
      // Add all coordinates of the route line
      routeCoords.forEach((pt) => group.push(pt));
    }

    if (group.length > 0) {
      const bounds = L.latLngBounds(group);
      map.fitBounds(bounds, {
        padding: [30, 30],
        maxZoom: 15,
        animate: true,
        duration: 0.8
      });
    }

  }, [leafletLoaded, pickupCoords, dropCoords, routeCoords, carCoords, interactive]);

  // Cleanup map instance on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative" style={{ zIndex: 1 }}>
      {!leafletLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-bgLight text-brand-textGray text-xs font-semibold gap-2">
          <div className="w-5 h-5 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
          <span>Initializing Map...</span>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default MapComponent;
