#!/bin/bash

echo "Building and setting up Android app..."

# Build the web app first
echo "Building web application..."
npm run build

# Initialize Capacitor project
echo "Initializing Capacitor project..."
npx cap init "Location Tracker" "com.locationtracker.app" --web-dir=dist

# Add Android platform
echo "Adding Android platform..."
npx cap add android

# Sync web code to Android
echo "Syncing web code with Android platform..."
npx cap sync android

echo "Android project setup complete!"
echo "To build the APK, you need to open the project in Android Studio:"
echo "npx cap open android"
echo ""
echo "Then build the APK from Android Studio."