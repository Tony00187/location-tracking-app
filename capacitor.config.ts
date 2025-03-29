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
      // Geolocation permissions
      permissions: {
        "android": ["android.permission.ACCESS_COARSE_LOCATION", "android.permission.ACCESS_FINE_LOCATION"]
      }
    },
    BackgroundRunner: {
      label: 'com.locationtracker.locationservice',
      src: 'background/locationService.js',
      event: 'tracking',
      interval: 300000, // Every 5 minutes
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