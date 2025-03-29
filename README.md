# Location Tracker App

A web-based location tracking application that can be packaged as an Android APK for continuous 24/7 location tracking.

## Features

- Real-time location tracking with high accuracy
- Background tracking (continues even when app is closed)
- Admin dashboard with map visualization of user location history
- User permission request handling
- Works on both web and Android platforms
- Separate APKs for users and administrators

## Documentation

Detailed guides are available in the `docs` folder:

- [Quick Start Guide](docs/QUICK_START_GUIDE.md) - Simple steps to get everything running
- [APK Build Guide](docs/APK_BUILD_GUIDE.md) - Instructions for building user and admin APKs
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) - How to deploy your server and configure APKs

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

## Building Android APKs

You can build two separate APKs:

### User APK (for people being tracked)

```bash
./build-user-apk.sh
```

### Admin APK (for viewing all locations)

```bash
./build-admin-apk.sh
```

Follow the on-screen instructions to complete the build process in Android Studio.

## Server Deployment

For the tracking system to work properly, you need to deploy the server:

1. Deploy the application to a hosting service (like Replit Deployments)
2. Update the API URL in the APKs:
   ```bash
   ./update-api-url.sh https://your-app-domain.replit.app
   ```
3. Rebuild both APKs using the scripts above

## Available Scripts

- `build-user-apk.sh` - Prepares and builds the user version APK
- `build-admin-apk.sh` - Prepares and builds the admin version APK
- `build-android.sh` - Builds the full combined app APK
- `run-android.sh` - Runs the app on a connected Android device
- `update-api-url.sh` - Updates the API endpoint URL in the background service

## Privacy Notice

This application tracks user location continuously in the background. Make sure users are aware of this and have given proper consent before installing the app.