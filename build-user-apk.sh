#!/bin/bash

echo "Building User APK..."

# Create a temporary file with user-only App.tsx configuration
USER_APP_CONTENT=$(cat <<'EOF'
import { Route, Switch } from "wouter";
import WelcomeScreen from "./pages/WelcomeScreen";
import PermissionScreen from "./pages/PermissionScreen";
import SuccessScreen from "./pages/SuccessScreen";
import ErrorScreen from "./pages/ErrorScreen";
import NotFound from "./pages/not-found";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import "./index.css";
import { Toaster } from "./components/ui/toaster";

// User App only has regular user routes
function Router() {
  return (
    <Switch>
      <Route path="/" component={WelcomeScreen} />
      <Route path="/permission" component={PermissionScreen} />
      <Route path="/success" component={SuccessScreen} />
      <Route path="/error" component={ErrorScreen} />
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

# Replace with user-only version
echo "$USER_APP_CONTENT" > client/src/App.tsx

# Update the app name in capacitor.config.ts
sed -i 's/appName: "Location Tracker"/appName: "Location Tracker - User"/g' capacitor.config.ts

# Initialize Capacitor if not already done
if [ ! -d "android" ]; then
  echo "Initializing Capacitor..."
  node init-capacitor.js
fi

# Build the app
echo "Building the app..."
npm run build

# Sync with Capacitor
echo "Syncing with Capacitor..."
npx cap sync android

# Build the APK directly using Gradle
echo "Building APK with Gradle..."
cd android
./gradlew assembleDebug
cd ..

echo "User APK build complete!"
echo "APK is available at: android/app/build/outputs/apk/debug/app-debug.apk"

# Restore original App.tsx
mv client/src/App.tsx.backup client/src/App.tsx

# Restore original app name
sed -i 's/appName: "Location Tracker - User"/appName: "Location Tracker"/g' capacitor.config.ts