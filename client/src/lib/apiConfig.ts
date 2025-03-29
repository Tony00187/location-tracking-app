/**
 * API configuration utilities
 */

// Check if Capacitor is available
const isCapacitorAvailable = () => {
  return typeof window !== 'undefined' && typeof (window as any).Capacitor !== 'undefined';
};

// Set the API URL in storage for both web and native apps
export async function setApiUrl(url: string): Promise<boolean> {
  try {
    if (!url) return false;
    
    // Make sure URL ends with /
    const formattedUrl = url.endsWith('/') ? url : `${url}/`;
    
    // For mobile apps
    if (isCapacitorAvailable()) {
      try {
        // Using direct import to avoid dynamic import issues
        const CapacitorStorage = (window as any).Capacitor.Plugins.Storage;
        await CapacitorStorage.set({
          key: 'apiUrl',
          value: formattedUrl
        });
      } catch (err) {
        console.error('Failed to use Capacitor Storage:', err);
      }
    }
    
    // For web apps (backup)
    localStorage.setItem('apiUrl', formattedUrl);
    
    console.log(`API URL set to: ${formattedUrl}`);
    return true;
  } catch (error) {
    console.error('Failed to set API URL:', error);
    return false;
  }
}

// Get the current API URL
export async function getApiUrl(): Promise<string | null> {
  try {
    // For mobile apps
    if (isCapacitorAvailable()) {
      try {
        // Using direct import to avoid dynamic import issues
        const CapacitorStorage = (window as any).Capacitor.Plugins.Storage;
        const { value } = await CapacitorStorage.get({ key: 'apiUrl' });
        if (value) return value;
      } catch (err) {
        console.error('Failed to use Capacitor Storage:', err);
      }
    }
    
    // Fallback to localStorage
    return localStorage.getItem('apiUrl');
  } catch (error) {
    console.error('Failed to get API URL:', error);
    return null;
  }
}