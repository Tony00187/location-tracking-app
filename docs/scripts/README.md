# Scripts Documentation

This folder contains scripts related to the build and deployment process of the Location Tracker application.

## Script Overview

### `build-user-apk.sh`

This script builds the User version of the Android APK:
- Creates a user-only version of the app (without admin dashboard)
- Changes the app name to "Location Tracker - User"
- Builds the app and syncs with Capacitor
- Provides instructions for completing the build in Android Studio

### `build-admin-apk.sh`

This script builds the Admin version of the Android APK:
- Creates an admin-only version of the app (only the admin dashboard)
- Changes the app name to "Location Tracker - Admin"
- Builds the app and syncs with Capacitor
- Provides instructions for completing the build in Android Studio

### `build-android.sh`

This script builds the full combined Android APK:
- Builds the complete app with both user and admin functionality
- Syncs with Capacitor
- Initializes the Android project if needed

### `run-android.sh`

This script runs the app directly on a connected Android device:
- Syncs the latest web changes to the Android project
- Launches the app on a connected device or emulator

### `update-api-url.sh`

This script updates the API URL in the background location service:
- Takes a URL parameter (e.g., `https://your-app-domain.replit.app`)
- Updates the API endpoint in `background/locationService.js`
- Should be run after deploying your server and before building APKs

## Usage Flow

Typical usage flow for creating separate APKs:

1. Deploy the server (Replit Deployments)
2. Update API URL: `./update-api-url.sh https://your-app-domain.replit.app`
3. Build User APK: `./build-user-apk.sh`
4. Build Admin APK: `./build-admin-apk.sh`
5. Complete the build process in Android Studio for each APK
6. Distribute the APKs to the appropriate users