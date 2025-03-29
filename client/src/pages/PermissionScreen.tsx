import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { LocationIcon } from "@/components/ui/location-icon";
import useLocationTracking from "@/hooks/useLocationTracking";

export default function PermissionScreen() {
  const [_, setLocation] = useLocation();
  const { requestPermission } = useLocationTracking();

  useEffect(() => {
    // Request permission and navigate to the appropriate screen
    const handlePermissionRequest = async () => {
      const permissionGranted = await requestPermission();
      
      if (permissionGranted) {
        setLocation("/success");
      } else {
        setLocation("/error");
      }
    };

    // Small delay to show the permission screen before requesting
    const timerId = setTimeout(() => {
      handlePermissionRequest();
    }, 500);

    return () => clearTimeout(timerId);
  }, [requestPermission, setLocation]);

  return (
    <Layout>
      <Card className="shadow-md">
        <CardContent className="pt-6 text-center">
          <div className="mb-6 flex justify-center">
            <LocationIcon type="searching" />
          </div>
          <h2 className="text-2xl font-medium mb-4">Location Permission</h2>
          <p className="mb-6 text-muted-foreground">
            Please enable your location to continue. This app requires location access to function properly.
          </p>
          <div className="p-4 bg-gray-100 rounded-md mb-6">
            <p className="text-sm text-muted-foreground italic">
              The browser is requesting permission to access your location.
              Please select "Allow" in the permission dialog.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-secondary border-r-transparent"></div>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}
