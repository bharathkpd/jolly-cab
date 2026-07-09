export interface MapSuggestion {
  name: string;
  lat: number;
  lon: number;
}

export interface MapRouteInfo {
  distanceKm: number;
  durationMin: number;
  routeCoords: [number, number][];
  tolls: number;
}

// Helper to get active Google Maps key
const getGoogleApiKey = (): string | null => {
  return localStorage.getItem('jolly_cabs_google_api_key') || null;
};

// Standard Google polyline decoder
const decodeGooglePolyline = (encoded: string): [number, number][] => {
  const points: [number, number][] = [];
  let index = 0, len = encoded.length;
  let lat = 0, lng = 0;

  while (index < len) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    points.push([lat / 1e5, lng / 1e5]);
  }
  return points;
};

// 1. Fetch suggestions using either Google Geocoding API or Nominatim
export const fetchAddressSuggestions = async (query: string): Promise<MapSuggestion[]> => {
  if (!query || query.trim().length < 3) {
    return [];
  }

  const apiKey = getGoogleApiKey();
  if (apiKey) {
    try {
      // Use Google Maps Geocoding API (returns coordinates directly)
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&components=country:in&key=${apiKey}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data && data.results && data.results.length > 0) {
          return data.results.map((item: any) => ({
            name: item.formatted_address,
            lat: item.geometry.location.lat,
            lon: item.geometry.location.lng
          }));
        }
      }
    } catch (err) {
      console.warn('Google Geocoding failed, falling back to Nominatim.', err);
    }
  }

  // Fallback: Free Nominatim API
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ' India')}&countrycodes=in&limit=5`,
      {
        headers: {
          'Accept-Language': 'en'
        }
      }
    );
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        return data.map((item: any) => ({
          name: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon)
        }));
      }
    }
  } catch (err) {
    console.error('Nominatim search failed:', err);
  }

  return [];
};

// 2. Fetch routing path, distance, and duration using either Google Directions or OSRM
export const fetchMapRoute = async (
  pLat: number,
  pLon: number,
  dLat: number,
  dLon: number
): Promise<MapRouteInfo | null> => {
  const apiKey = getGoogleApiKey();
  if (apiKey) {
    try {
      // Use Google Directions API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${pLat},${pLon}&destination=${dLat},${dLon}&key=${apiKey}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data && data.routes && data.routes[0]) {
          const route = data.routes[0];
          const leg = route.legs[0];
          
          const distanceKm = Math.round(leg.distance.value / 1000);
          const durationMin = Math.round(leg.duration.value / 60);
          
          // Decode Google's encoded polyline coordinates
          const routeCoords = decodeGooglePolyline(route.overview_polyline.points);
          
          // Calculate tolls
          let tolls = 0;
          if (distanceKm > 200) tolls = 350;
          else if (distanceKm > 100) tolls = 180;
          else if (distanceKm > 35) tolls = 80;

          return { distanceKm, durationMin, routeCoords, tolls };
        }
      }
    } catch (err) {
      console.warn('Google Directions API failed, falling back to OSRM.', err);
    }
  }

  // Fallback: OSRM Routing API
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${pLon},${pLat};${dLon},${dLat}?overview=full&geometries=geojson`
    );
    if (response.ok) {
      const data = await response.json();
      if (data && data.routes && data.routes[0]) {
        const route = data.routes[0];
        const distanceKm = Math.round(route.distance / 1000);
        const durationMin = Math.round(route.duration / 60);
        
        // Flip OSRM's [lng, lat] coordinates to [lat, lng]
        const routeCoords = route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
        
        let tolls = 0;
        if (distanceKm > 200) tolls = 350;
        else if (distanceKm > 100) tolls = 180;
        else if (distanceKm > 35) tolls = 80;

        return { distanceKm, durationMin, routeCoords, tolls };
      }
    }
  } catch (err) {
    console.error('OSRM route calculation failed:', err);
  }

  return null;
};
