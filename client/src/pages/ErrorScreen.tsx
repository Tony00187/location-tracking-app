import { useCallback } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { LocationIcon } from "@/components/ui/location-icon";

export default function ErrorScreen() {
  const [_, setLocation] = useLocation();

  const handleRetryPermission = useCallback(() => {
    setLocation("/permission");
  }, [setLocation]);

  return (
    <Layout>
      <Card className="shadow-md">
        <CardContent className="pt-6 text-center">
          <div className="mb-6 flex justify-center">
            <LocationIcon type="error" />
          </div>
          <h2 className="text-2xl font-medium mb-4 text-destructive">Location Access Denied</h2>
          <p className="mb-6 text-muted-foreground">
            This app requires location access to function. Please enable location services and try again.
          </p>
          <div className="p-4 bg-destructive bg-opacity-10 rounded-md mb-6">
            <p className="text-sm text-destructive">
              You denied permission to access your location. To use this app, you'll need to allow location access.
            </p>
          </div>
          <Button 
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 py-2 px-6 rounded-md uppercase text-sm font-medium tracking-wider shadow-md"
            onClick={handleRetryPermission}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    </Layout>
  );
}
