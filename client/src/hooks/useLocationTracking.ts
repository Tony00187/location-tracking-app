import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "@/lib/queryClient";

// Check if Capacitor is available (when running as native app)
const isCapacitorAvailable = () => {
  return typeof (window as any).Capacitor !== 'undefined';
};

// Dynamically import Capacitor plugins when available
let Geolocation: any = null;
let BackgroundRunner: any = null;

// Only import and use Capacitor in a browser environment
if (typeof window !== 'undefined' && isCapacitorAvailable()) {
  import('@capacitor/geolocation').then(module => {
    Geolocation = module.Geolocation;
  });
  
  import('@capacitor/background-runner').then(module => {
    BackgroundRunner = module.BackgroundRunner;
  });
}

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
  const [userId] = useState<string>(() => {
    // Get the user ID from localStorage or generate a new one
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      return storedUserId;
    }
    
    // Generate a new UUID
    const newUserId = crypto.randomUUID();
    localStorage.setItem("userId", newUserId);
    return newUserId;
  });

  // Send location data to the server
  const sendLocationToServer = useCallback(async (locationData: LocationData) => {
    try {
      await apiRequest("POST", "/api/location", {
        ...locationData,
        userId
      });
    } catch (err) {
      console.error("Failed to send location data to server:", err);
    }
  }, [userId]);

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
    // Use Capacitor Geolocation if available
    if (isCapacitorAvailable() && Geolocation) {
      console.log('Using Capacitor Geolocation for tracking');
      
      // Set up background tracking using the BackgroundRunner
      if (BackgroundRunner) {
        try {
          // Check if background runner is available
          BackgroundRunner.isAvailable().then((result: { available: boolean }) => {
            if (result.available) {
              console.log('Starting background location tracking');
              // Start the background runner
              BackgroundRunner.startTask({ 
                taskId: 'location-tracking',
                event: 'tracking'
              });
            } else {
              console.log('Background runner not available, using regular tracking');
            }
          });
        } catch (error) {
          console.error('Error setting up background tracking:', error);
        }
      }
      
      // Also track in foreground while app is open
      Geolocation.watchPosition({
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }, (position: any) => {
        const geoPosition = {
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          },
          timestamp: position.timestamp
        };
        updateLocation(geoPosition as GeolocationPosition);
      });
      
      setIsTracking(true);
      setError(null);
      
      return;
    }
    
    // Fallback to browser geolocation
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
    // Stop tracking with Capacitor if available
    if (isCapacitorAvailable()) {
      if (BackgroundRunner) {
        try {
          // Stop the background tracker
          BackgroundRunner.stopTask({ taskId: 'location-tracking' });
        } catch (error) {
          console.error('Error stopping background tracking:', error);
        }
      }
      
      if (Geolocation) {
        try {
          // No direct way to clear watch in Capacitor, but we can stop tracking
          console.log('Stopping Capacitor location tracking');
        } catch (error) {
          console.error('Error stopping Capacitor tracking:', error);
        }
      }
    }
    
    // Also clear browser tracking if active
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    
    setIsTracking(false);
  }, [watchId]);

  // Request permission to use geolocation
  const requestPermission = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      // Use Capacitor Geolocation if available
      if (isCapacitorAvailable() && Geolocation) {
        console.log('Requesting Capacitor location permissions');
        Geolocation.requestPermissions()
          .then((permissionResult: any) => {
            console.log('Permission result:', permissionResult);
            if (permissionResult.location === 'granted') {
              // Get current position
              Geolocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
              }).then((position: any) => {
                const geoPosition = {
                  coords: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                  },
                  timestamp: position.timestamp
                };
                updateLocation(geoPosition as GeolocationPosition);
                resolve(true);
              }).catch((err: any) => {
                console.error('Error getting location:', err);
                setError(err);
                resolve(false);
              });
            } else {
              resolve(false);
            }
          })
          .catch((err: any) => {
            console.error('Error requesting permissions:', err);
            setError(err);
            resolve(false);
          });
        return;
      }
      
      // Fallback to browser geolocation
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
