#!/bin/bash

echo "Building Admin APK..."

# Create a temporary file with admin-only App.tsx configuration
ADMIN_APP_CONTENT=$(cat <<'EOF'
import { Route, Switch } from "wouter";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/not-found";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import "./index.css";
import { Toaster } from "./components/ui/toaster";

// Admin App only has admin dashboard route
function Router() {
  return (
    <Switch>
      <Route path="/" component={AdminDashboard} />
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
EOF
)

# Backup original App.tsx
cp client/src/App.tsx client/src/App.tsx.backup

# Replace with admin-only version
echo "$ADMIN_APP_CONTENT" > client/src/App.tsx

# Update the app name in capacitor.config.ts
sed -i 's/appName: "Location Tracker"/appName: "Location Tracker - Admin"/g' capacitor.config.ts

# Build the app
echo "Building the app..."
npm run build

# Sync with Capacitor
echo "Syncing with Capacitor..."
npx cap sync android

# Restore original App.tsx
mv client/src/App.tsx.backup client/src/App.tsx

# Restore original app name
sed -i 's/appName: "Location Tracker - Admin"/appName: "Location Tracker"/g' capacitor.config.ts

echo "Admin APK build preparation complete!"
echo ""
echo "To finish building the APK:"
echo "1. Run: npx cap open android"
echo "2. In Android Studio, go to Build > Build Bundle(s)/APK(s) > Build APK(s)"
echo "3. The APK will be in android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "After building, rename the APK to 'location-tracker-admin.apk' to distinguish it from the user version."