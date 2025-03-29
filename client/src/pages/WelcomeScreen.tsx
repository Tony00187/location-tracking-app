import { useCallback } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { LocationIcon } from "@/components/ui/location-icon";

export default function WelcomeScreen() {
  const [_, setLocation] = useLocation();

  const handlePermissionRequest = useCallback(() => {
    setLocation("/permission");
  }, [setLocation]);

  return (
    <Layout>
      <Card className="shadow-md">
        <CardContent className="pt-6 text-center">
          <div className="mb-6 flex justify-center">
            <LocationIcon type="default" />
          </div>
          <h2 className="text-2xl font-medium mb-4">Welcome</h2>
          <p className="mb-6 text-muted-foreground">
            Hello! This app needs access to your location to provide its services.
          </p>
          <Button 
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 py-2 px-6 rounded-md uppercase text-sm font-medium tracking-wider shadow-md"
            onClick={handlePermissionRequest}
          >
            Enable Location
          </Button>
        </CardContent>
      </Card>
    </Layout>
  );
}
