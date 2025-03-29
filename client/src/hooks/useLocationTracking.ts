import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "@/lib/queryClient";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface UseLocationTrackingResult {
  currentLocation: LocationData | null;
  isTracking: boolean;
  error: GeolocationPositionError | null;
  lastUpdated: string;
  startTracking: () => void;
  stopTracking: () => void;
  requestPermission: () => Promise<boolean>;
}

export default function useLocationTracking(): UseLocationTrackingResult {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [error, setError] = useState<GeolocationPositionError | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("Never");

  // Send location data to the server
  const sendLocationToServer = useCallback(async (locationData: LocationData) => {
    try {
      await apiRequest("POST", "/api/location", locationData);
    } catch (err) {
      console.error("Failed to send location data to server:", err);
    }
  }, []);

  // Update location data and timestamp
  const updateLocation = useCallback((position: GeolocationPosition) => {
    const newLocation: LocationData = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp,
    };
    setCurrentLocation(newLocation);
    setLastUpdated("Just now");
    sendLocationToServer(newLocation);

    // Update "last updated" text after a delay
    setTimeout(() => {
      setLastUpdated("Recently");
    }, 10000);
  }, [sendLocationToServer]);

  // Start tracking location
  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError(new GeolocationPositionError());
      return;
    }

    // Clear any existing watch
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
    }

    const id = navigator.geolocation.watchPosition(
      updateLocation,
      (err) => {
        setError(err);
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    setWatchId(id);
    setIsTracking(true);
    setError(null);
  }, [watchId, updateLocation]);

  // Stop tracking location
  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsTracking(false);
    }
  }, [watchId]);

  // Request permission to use geolocation
  const requestPermission = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setError(new GeolocationPositionError());
        resolve(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateLocation(position);
          resolve(true);
        },
        (err) => {
          setError(err);
          resolve(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    });
  }, [updateLocation]);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return {
    currentLocation,
    isTracking,
    error,
    lastUpdated,
    startTracking,
    stopTracking,
    requestPermission,
  };
}
