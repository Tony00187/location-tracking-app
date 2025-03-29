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

There are two ways to build the APKs:

### Automatic Build (both APKs)

To build both APKs at once and place them in the `outputs` folder:

```bash
./build-apks-to-outputs.sh
```

This will:
1. Build the user APK
2. Build the admin APK
3. Copy both APKs to the `outputs` folder as:
   - `user-app-debug.apk`
   - `admin-app-debug.apk`

### Manual Build (individual APKs)

You can also build each APK separately:

#### User APK (for people being tracked)

```bash
./build-user-apk.sh
```

#### Admin APK (for viewing all locations)

```bash
./build-admin-apk.sh
```

The APKs will be built automatically using Gradle, no need to open Android Studio.

## Server Deployment

For the tracking system to work properly, you need to deploy the server:

1. Deploy the application to a hosting service (like Replit Deployments)
2. Update the API URL in the APKs:
   ```bash
   ./update-api-url.sh https://your-app-domain.replit.app
   ```
3. Rebuild both APKs using the scripts above

## Available Scripts

- `build-apks-to-outputs.sh` - Builds both user and admin APKs and places them in the outputs folder
- `build-user-apk.sh` - Builds only the user version APK
- `build-admin-apk.sh` - Builds only the admin version APK
- `build-android.sh` - Builds the full combined app APK
- `run-android.sh` - Runs the app on a connected Android device
- `update-api-url.sh` - Updates the API endpoint URL in the background service

The server URL can also be configured directly in the user app by tapping "Configure Server URL" on the welcome screen.

## Privacy Notice

This application tracks user location continuously in the background. Make sure users are aware of this and have given proper consent before installing the app.