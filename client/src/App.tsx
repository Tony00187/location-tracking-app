import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import WelcomeScreen from "@/pages/WelcomeScreen";
import PermissionScreen from "@/pages/PermissionScreen";
import SuccessScreen from "@/pages/SuccessScreen";
import ErrorScreen from "@/pages/ErrorScreen";
import AdminDashboard from "@/pages/AdminDashboard";

function Router() {
  const [location] = useLocation();
  const [locationState, setLocationState] = useState<{
    permissionStatus: "prompt" | "granted" | "denied" | null;
  }>({
    permissionStatus: null,
  });

  useEffect(() => {
    // Check if the browser supports permissions
    if ("permissions" in navigator) {
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then((result) => {
          setLocationState({ permissionStatus: result.state as any });

          // Listen for changes to the permission state
          result.onchange = () => {
            setLocationState({ permissionStatus: result.state as any });
          };
        })
        .catch(() => {
          // If we can't query, default to prompt
          setLocationState({ permissionStatus: "prompt" });
        });
    } else {
      // Default for browsers that don't support the Permissions API
      setLocationState({ permissionStatus: "prompt" });
    }
  }, []);

  // Redirect to appropriate screen based on permission status
  useEffect(() => {
    if (locationState.permissionStatus === "granted" && location === "/") {
      window.location.href = "/success";
    } else if (locationState.permissionStatus === "denied" && location === "/") {
      window.location.href = "/error";
    }
  }, [locationState.permissionStatus, location]);

  return (
    <Switch>
      <Route path="/" component={WelcomeScreen} />
      <Route path="/permission" component={PermissionScreen} />
      <Route path="/success" component={SuccessScreen} />
      <Route path="/error" component={ErrorScreen} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
