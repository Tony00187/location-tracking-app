import { useCallback, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";
import { LocationIcon } from "@/components/ui/location-icon";
import { setApiUrl } from "@/lib/apiConfig";

export default function WelcomeScreen() {
  const [_, setLocation] = useLocation();
  const [serverUrl, setServerUrl] = useState<string>(() => {
    // Initialize with stored value if available
    return localStorage.getItem('apiUrl') || '';
  });
  const [showServerConfig, setShowServerConfig] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handlePermissionRequest = useCallback(() => {
    setLocation("/permission");
  }, [setLocation]);
  
  const handleServerConfig = useCallback(async () => {
    if (showServerConfig && serverUrl) {
      // Save the URL
      setIsSaving(true);
      await setApiUrl(serverUrl);
      setIsSaving(false);
      setShowServerConfig(false);
    } else {
      // Show the config panel
      setShowServerConfig(true);
    }
  }, [showServerConfig, serverUrl]);

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
          
          {showServerConfig ? (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Enter your server URL</p>
              <Input
                type="text"
                placeholder="https://your-server-url.replit.app"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                className="mb-2"
              />
              <div className="flex gap-2 justify-center">
                <Button 
                  variant="outline"
                  className="text-sm"
                  onClick={() => setShowServerConfig(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button 
                  className="text-sm"
                  onClick={handleServerConfig}
                  disabled={!serverUrl || isSaving}
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button 
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 py-2 px-6 rounded-md uppercase text-sm font-medium tracking-wider shadow-md"
                onClick={handlePermissionRequest}
              >
                Enable Location
              </Button>
              
              <Button 
                variant="ghost"
                className="text-xs text-muted-foreground"
                onClick={handleServerConfig}
              >
                Configure Server URL
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
}
