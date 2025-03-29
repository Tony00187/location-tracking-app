#!/bin/bash

echo "Building APKs and placing them in outputs folder..."

# Make sure outputs directory exists
mkdir -p outputs

echo "Building user APK..."
bash ./build-user-apk.sh

echo "Building admin APK..."
bash ./build-admin-apk.sh

# Copy the APK files to the outputs folder
echo "Copying APKs to outputs folder..."

# Location of user APK
if [ -f "android/app/build/outputs/apk/debug/app-debug.apk" ]; then
  cp android/app/build/outputs/apk/debug/app-debug.apk outputs/user-app-debug.apk
  echo "User APK copied to outputs/user-app-debug.apk"
else
  echo "User APK not found at expected location"
fi

# Clean the environment for admin APK
rm -rf android

# Build admin APK
echo "Building admin APK..."
bash ./build-admin-apk.sh

# Location of admin APK
if [ -f "android/app/build/outputs/apk/debug/app-debug.apk" ]; then
  cp android/app/build/outputs/apk/debug/app-debug.apk outputs/admin-app-debug.apk
  echo "Admin APK copied to outputs/admin-app-debug.apk"
else
  echo "Admin APK not found at expected location"
fi

echo "Build process completed. Check the outputs folder for the APK files."