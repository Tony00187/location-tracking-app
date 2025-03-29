#!/bin/bash

echo "Running Android app on connected device or emulator..."

# Sync latest web changes
echo "Syncing latest web changes..."
npx cap sync android

# Run the app
echo "Running the app..."
npx cap run android