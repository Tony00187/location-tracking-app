# Deployment Guide

This guide explains how to deploy your Location Tracker application to make it accessible on the internet.

## Deploying on Replit

The easiest way to deploy your Location Tracker application is using Replit Deployments:

1. In your Replit project, click on the "Deployment" tab in the sidebar
2. Click "Deploy"
3. Wait for the deployment process to complete
4. Replit will provide you with a deployment URL (e.g., https://your-app-domain.replit.app)

## Configuring APKs with Your Server URL

After deployment, you need to update the APKs to send data to your deployed server:

1. Note your deployment URL from Replit
2. Run the update script with your URL:
   ```bash
   ./update-api-url.sh https://your-app-domain.replit.app
   ```
3. This will update the background location service to send location data to your server

## Building Updated APKs

Now build both APKs with the updated server URL:

1. Build the User APK:
   ```bash
   ./build-user-apk.sh
   ```

2. Build the Admin APK:
   ```bash
   ./build-admin-apk.sh
   ```

3. Follow the instructions in each script to complete the APK build process in Android Studio

## Testing the Deployment

Before distributing to users, test your deployment:

1. Install the User APK on a test device
2. Grant location permissions
3. Install the Admin APK on your device
4. Check if the test device's location appears in the admin dashboard

## Security Considerations

When deploying your application:

1. Consider adding user authentication for the admin dashboard
2. Use HTTPS for all communication (Replit Deployments provides this by default)
3. Consider privacy regulations when collecting location data from users
4. Get explicit consent from users before tracking their location

## Scaling Your Deployment

For a production environment with many users:

1. Consider upgrading to a persistent database instead of in-memory storage
2. Add proper error handling and retry mechanisms
3. Implement a caching layer for better performance
4. Consider rate limiting to prevent abuse

## Monitoring Your Deployment

Keep an eye on your application:

1. Check the server logs regularly
2. Monitor server performance and resource usage
3. Set up alerts for downtime or errors
4. Regularly back up your data

## Updating Your Deployment

When you make changes to your application:

1. Test changes locally
2. Deploy to Replit
3. Update the API URL in the background service
4. Rebuild and distribute updated APKs to users