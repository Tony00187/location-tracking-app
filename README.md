# Location Tracker App

A web-based location tracking application that can be packaged as an Android APK for continuous 24/7 location tracking.

## Features

- Real-time location tracking with high accuracy
- Background tracking (continues even when app is closed)
- Admin dashboard with map visualization of user location history
- User permission request handling
- Works on both web and Android platforms

## Web Application

The web application is built using:
- React for the frontend
- Express.js for the backend
- Leaflet for map visualizations
- In-memory storage for data persistence

### Running the Web Application

1. Start the application:
   ```
   npm run dev
   ```

2. Access the user app at `/` and the admin dashboard at `/admin`

## Building the Android APK

To convert the web app into an Android APK that can be distributed:

### Prerequisites

- [Android Studio](https://developer.android.com/studio) installed
- Android SDK set up
- Java Development Kit (JDK) installed

### Build Process

1. Run the build script:
   ```
   ./build-android.sh
   ```

2. Open the project in Android Studio:
   ```
   npx cap open android
   ```

3. In Android Studio:
   - Wait for the project to sync and build
   - Go to Build > Build Bundle(s) / APK(s) > Build APK(s)
   - The APK will be generated in `android/app/build/outputs/apk/debug/`

4. Alternatively, you can run the app directly on a connected device:
   ```
   ./run-android.sh
   ```

### Distributing the APK

1. Locate the generated APK file at `android/app/build/outputs/apk/debug/app-debug.apk`
2. Share this APK file with users via email, messaging apps, or a download link
3. Users need to enable "Install from Unknown Sources" on their Android devices to install the APK
4. Once installed and permissions granted, the app will track location continuously

## Server Setup for Production

For the admin to track all users, set up the server on a publicly accessible host:

1. Deploy the application to a hosting service (like Replit Deployments)
2. Update the server URL in the background location service:
   - Edit `background/locationService.js` and update the `apiUrl` to point to your deployed server

## Privacy Notice

This application tracks user location continuously in the background. Make sure users are aware of this and have given proper consent before installing the app.