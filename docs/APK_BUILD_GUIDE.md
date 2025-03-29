# APK Build Guide

This guide explains how to build both User and Admin APKs for the Location Tracker application.

## Prerequisites

Before proceeding, ensure you have:
- [Android Studio](https://developer.android.com/studio) installed
- Android SDK configured
- JDK 11 or higher installed
- Node.js and npm installed
- Internet connection for package downloads

## Deploying the Server

Before building the APKs, you should deploy your backend server:

1. Deploy your application to a hosting service like Replit Deployments
2. Note the URL of your deployed application (e.g., https://your-app-domain.replit.app)
3. This URL will be needed to configure the APKs to send data to your server

## Updating the API URL

Update the API URL in your application to point to your deployed server:

```bash
./update-api-url.sh https://your-app-domain.replit.app
```

This script updates the background location service to send data to your deployed server.

## Building the User APK

The User APK is the version you'll distribute to users who need to be tracked.

1. Run the user build script:
   ```bash
   ./build-user-apk.sh
   ```

2. Open Android Studio:
   ```bash
   npx cap open android
   ```

3. In Android Studio:
   - Wait for the project to sync
   - Go to Build > Build Bundle(s) / APK(s) > Build APK(s)
   - The APK file will be generated in `android/app/build/outputs/apk/debug/app-debug.apk`
   - Rename it to `location-tracker-user.apk` for clarity

4. This APK includes:
   - Welcome screen
   - Permission request screen
   - Location tracking in foreground and background
   - No access to the admin dashboard

## Building the Admin APK

The Admin APK is for you as the administrator to view all user locations.

1. Run the admin build script:
   ```bash
   ./build-admin-apk.sh
   ```

2. Open Android Studio:
   ```bash
   npx cap open android
   ```

3. In Android Studio:
   - Wait for the project to sync
   - Go to Build > Build Bundle(s) / APK(s) > Build APK(s)
   - The APK file will be generated in `android/app/build/outputs/apk/debug/app-debug.apk`
   - Rename it to `location-tracker-admin.apk` for clarity

4. This APK includes:
   - Only the admin dashboard
   - Map view of all user locations
   - List view with timestamps

## Distributing the APKs

### User APK Distribution

1. Share the `location-tracker-user.apk` file with users via:
   - Email
   - Messaging apps
   - Download link from cloud storage
   - Private app store

2. Instruct users to:
   - Enable "Install from Unknown Sources" in their device settings
   - Install the APK
   - Grant all location permissions when prompted
   - Keep the app installed to enable background tracking

### Admin APK Usage

1. Install the `location-tracker-admin.apk` on your own device
2. When opened, it will directly show the admin dashboard
3. You'll be able to see all user locations in real-time and historical data

## Troubleshooting

### If locations aren't appearing in the Admin dashboard:

1. Verify the API URL was set correctly with `./update-api-url.sh`
2. Check that users have granted all location permissions
3. Ensure the server is deployed and accessible
4. Verify users have an active internet connection

### If APK fails to build:

1. Make sure Android Studio is properly configured
2. Verify the Android SDK is installed
3. Check that JDK 11+ is properly set up
4. Run `npx cap doctor` to verify your Capacitor setup