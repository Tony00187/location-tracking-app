import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { LocationIcon } from "@/components/ui/location-icon";
import useLocationTracking from "@/hooks/useLocationTracking";

export default function SuccessScreen() {
  const { 
    currentLocation, 
    isTracking, 
    startTracking, 
    lastUpdated 
  } = useLocationTracking();

  useEffect(() => {
    if (!isTracking) {
      startTracking();
    }
  }, [isTracking, startTracking]);

  return (
    <Layout>
      <Card className="shadow-md">
        <CardContent className="pt-6 text-center">
          <div className="mb-6 flex justify-center">
            <div className="h-24 w-24 rounded-full bg-success bg-opacity-20 flex items-center justify-center animate-pulse">
              <LocationIcon type="success" />
            </div>
          </div>
          <h2 className="text-2xl font-medium mb-4 text-success">Location Access Enabled</h2>
          <p className="mb-6 text-muted-foreground">
            Thank you! Your location is now being tracked. You can keep this app running in the background.
          </p>
          <div className="p-4 bg-success bg-opacity-10 rounded-md mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <p className="text-sm text-success">
              GPS signal active and transmitting
            </p>
          </div>
          
          {/* Location coordinates display */}
          <div className="text-left text-sm text-muted-foreground mb-6">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span>Latitude:</span>
              <span>{currentLocation?.latitude.toFixed(6) || "Waiting..."}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span>Longitude:</span>
              <span>{currentLocation?.longitude.toFixed(6) || "Waiting..."}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span>Accuracy:</span>
              <span>{currentLocation ? `${currentLocation.accuracy.toFixed(1)} meters` : "Waiting..."}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Last Updated:</span>
              <span>{lastUpdated}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}
