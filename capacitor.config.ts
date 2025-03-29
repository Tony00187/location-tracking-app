import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.locationtracker.app',
  appName: 'Location Tracker',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Geolocation: {
      // Geolocation permissions for background access
      permissions: {
        "android": [
          "android.permission.ACCESS_COARSE_LOCATION", 
          "android.permission.ACCESS_FINE_LOCATION",
          "android.permission.ACCESS_BACKGROUND_LOCATION"
        ]
      }
    },
    BackgroundRunner: {
      label: 'com.locationtracker.locationservice',
      src: 'background/locationService.js',
      event: 'tracking',
      repeat: true,
      interval: 120000, // Every 2 minutes for more frequent updates
      autoStart: true
    }
  },
  // Additional Android settings
  android: {
    backgroundColor: "#FFFFFF",
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  }
};

export default config;