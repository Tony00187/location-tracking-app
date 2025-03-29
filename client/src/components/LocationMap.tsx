import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Location } from '@shared/schema';

// Fix the Leaflet default icon issue
const fixLeafletIcon = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

interface LocationMapProps {
  locations: Location[];
  height?: string;
}

const LocationMap = ({ locations, height = '500px' }: LocationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  
  // Initialize map on component mount
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Fix the icon issue
    fixLeafletIcon();
    
    // Create map if it doesn't exist yet
    if (!leafletMapRef.current) {
      leafletMapRef.current = L.map(mapRef.current).setView([0, 0], 2);
      
      // Add the OpenStreetMap tiles (free to use)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(leafletMapRef.current);
    }
    
    // Cleanup function to destroy map on unmount
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);
  
  // Update markers when locations change
  useEffect(() => {
    if (!leafletMapRef.current || !locations.length) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Add new markers for each location
    const bounds = L.latLngBounds([]);
    
    locations.forEach((location, index) => {
      const { latitude, longitude } = location;
      const latLng = L.latLng(latitude, longitude);
      
      // Skip invalid coordinates
      if (latitude === 0 && longitude === 0) return;
      
      // Add to bounds for auto-zoom
      bounds.extend(latLng);
      
      // Create marker with popup
      const marker = L.marker(latLng)
        .addTo(leafletMapRef.current!)
        .bindPopup(`
          <strong>${index === 0 ? 'Current Location' : `Location #${locations.length - index}`}</strong><br>
          Latitude: ${latitude.toFixed(6)}<br>
          Longitude: ${longitude.toFixed(6)}<br>
          Accuracy: ${location.accuracy.toFixed(1)} meters<br>
          Time: ${new Date(location.timestamp).toLocaleString()}
        `);
      
      // Highlight the most recent location
      if (index === 0) {
        marker.setZIndexOffset(1000);
        
        // Create accuracy circle for current location
        const accuracyCircle = L.circle(latLng, {
          radius: location.accuracy,
          fillColor: '#3388ff',
          fillOpacity: 0.15,
          color: '#3388ff',
          weight: 1
        }).addTo(leafletMapRef.current!);
        
        // Add to markers ref for cleanup
        markersRef.current.push(marker);
        markersRef.current.push(accuracyCircle as unknown as L.Marker);
      } else {
        markersRef.current.push(marker);
      }
    });
    
    // Fit the map to show all markers if we have valid bounds
    if (bounds.isValid()) {
      leafletMapRef.current.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 16
      });
    }
  }, [locations]);
  
  return (
    <div 
      ref={mapRef} 
      style={{ height, width: '100%', borderRadius: '0.5rem' }}
      className="border"
    />
  );
};

export default LocationMap;