/**
 * Background location tracking service for Android
 * This will run even when the app is closed
 */

export async function echoHandler(event) {
  const { value } = event.detail;
  const response = { value: value };
  return response;
}

// Get user ID from storage
export async function getUserId() {
  try {
    // Try to get the stored user ID
    const userId = await getValue('userId');
    if (userId) {
      return userId;
    }
    
    // Generate a new ID if none exists
    const newId = generateId();
    await setValue('userId', newId);
    return newId;
  } catch (error) {
    console.error('Error getting/setting userId:', error);
    return 'anonymous-' + Date.now();
  }
}

// Generate a pseudo-UUID
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Store value in persistent storage
export async function setValue(key, value) {
  try {
    await self.capacitorExports.Storage.set({
      key: key,
      value: value
    });
    return true;
  } catch (error) {
    console.error('Error setting value:', error);
    return false;
  }
}

// Get value from persistent storage
export async function getValue(key) {
  try {
    const { value } = await self.capacitorExports.Storage.get({ key: key });
    return value;
  } catch (error) {
    console.error('Error getting value:', error);
    return null;
  }
}

// Track location and send to server
export async function trackingHandler() {
  try {
    console.log('[Background] Starting location tracking');
    
    // Get the user ID
    const userId = await getUserId();
    
    // Get current position
    const position = await self.capacitorExports.Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });
    
    // Format the location data
    const locationData = {
      userId: userId,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: new Date().getTime()
    };
    
    console.log('[Background] Location data:', JSON.stringify(locationData));
    
    // Send to server
    await sendLocationToServer(locationData);
    
    console.log('[Background] Location tracking complete');
    return { success: true };
  } catch (error) {
    console.error('[Background] Error tracking location:', error);
    return { success: false, error: error.message };
  }
}

// Send location data to the server
async function sendLocationToServer(locationData) {
  try {
    // Get the API URL from storage or use the default
    const storedApiUrl = await getValue('apiUrl');
    const apiUrl = storedApiUrl || 'https://your-app-domain.replit.app/api/location';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(locationData)
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('[Background] Server response:', JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('[Background] Failed to send location data:', error);
    
    // Store failed updates for later retry
    const pendingUpdates = await getValue('pendingLocationUpdates') || '[]';
    const updates = JSON.parse(pendingUpdates);
    updates.push(locationData);
    
    // Keep only the last 50 pending updates to avoid excessive storage
    if (updates.length > 50) {
      updates.shift();
    }
    
    await setValue('pendingLocationUpdates', JSON.stringify(updates));
    return false;
  }
}

// Register handlers
export function registerPlugin() {
  const plugin = {
    name: 'LocationTracker',
    methods: {
      echo: {
        name: 'echo',
        handler: echoHandler
      },
      tracking: {
        name: 'tracking',
        handler: trackingHandler
      }
    }
  };
  
  return plugin;
}