#!/bin/bash

# Check if a URL is provided
if [ $# -eq 0 ]; then
    echo "Error: Please provide the API URL as a parameter."
    echo "Usage: ./update-api-url.sh https://your-app-domain.replit.app"
    exit 1
fi

API_URL=$1

# Validate URL format
if [[ ! $API_URL =~ ^https?:// ]]; then
    echo "Error: Invalid URL format. URL must start with http:// or https://"
    echo "Example: https://your-app-domain.replit.app"
    exit 1
fi

echo "Updating API URL to $API_URL..."

# Update the URL in the background location service
sed -i "s|const apiUrl = 'https://your-app-domain.replit.app/api/location';|const apiUrl = '$API_URL/api/location';|g" background/locationService.js

echo "API URL updated successfully!"
echo "Remember to rebuild the Android app after making this change:"
echo "1. Run ./build-android.sh"
echo "2. Open in Android Studio with: npx cap open android"
echo "3. Build the APK in Android Studio"