# Quick Start Guide

This guide provides a quick overview of how to get your Location Tracker app up and running.

## Step 1: Deploy the Server

1. Deploy this project using Replit Deployments:
   - Click the "Deployment" tab in the sidebar
   - Click "Deploy"
   - Note your deployment URL (e.g., https://your-app-domain.replit.app)

## Step 2: Configure the API URL

Update the API URL to point to your deployed server:

```bash
./update-api-url.sh https://your-app-domain.replit.app
```

## Step 3: Build User and Admin APKs

Build separate APKs for users and administrators:

### User APK (for tracking)

```bash
./build-user-apk.sh
```

### Admin APK (for monitoring)

```bash
./build-admin-apk.sh
```

For each script, follow the on-screen instructions to complete the build in Android Studio.

## Step 4: Distribute the APKs

1. Send the User APK to people you want to track
2. Install the Admin APK on your own device
3. Instruct users to:
   - Enable "Install from Unknown Sources" in settings
   - Install the APK
   - Grant all requested permissions

## Step 5: Monitor Locations

1. Open the Admin APK on your device
2. View user locations on the map
3. Check the list view for detailed location history

## Troubleshooting

If you encounter issues:
- Check that your server is properly deployed
- Verify the API URL was correctly updated
- Ensure users have granted all permissions
- Check that users have an active internet connection

For detailed instructions, refer to:
- [APK Build Guide](APK_BUILD_GUIDE.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)