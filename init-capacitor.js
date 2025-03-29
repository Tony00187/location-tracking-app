const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Initializing Capacitor project...');

// Ensure we have a build directory first
console.log('Building the web application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}

// Initialize Capacitor if not already done
if (!fs.existsSync('android')) {
  console.log('Initializing Capacitor Android platform...');
  try {
    execSync('npx cap init "Location Tracker" "com.locationtracker.app" --web-dir=dist', { stdio: 'inherit' });
  } catch (error) {
    console.error('Capacitor initialization failed:', error.message);
    process.exit(1);
  }
}

// Add Android platform
if (!fs.existsSync('android')) {
  console.log('Adding Android platform...');
  try {
    execSync('npx cap add android', { stdio: 'inherit' });
  } catch (error) {
    console.error('Adding Android platform failed:', error.message);
    process.exit(1);
  }
}

// Update Android platform with latest web code
console.log('Syncing web code with Android platform...');
try {
  execSync('npx cap sync android', { stdio: 'inherit' });
} catch (error) {
  console.error('Syncing Android platform failed:', error.message);
  process.exit(1);
}

// Patch the AndroidManifest.xml to ensure we have the required permissions
try {
  console.log('Adding background location permissions to AndroidManifest.xml...');
  const manifestPath = path.join('android', 'app', 'src', 'main', 'AndroidManifest.xml');
  
  if (fs.existsSync(manifestPath)) {
    let manifestContent = fs.readFileSync(manifestPath, 'utf8');
    
    // Check if permissions already exist
    if (!manifestContent.includes('ACCESS_BACKGROUND_LOCATION')) {
      // Add background location permission after the existing permissions
      const permissionsToAdd = `
    <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />`;
      
      // Insert permissions after the last existing permission tag
      manifestContent = manifestContent.replace(
        /<\/manifest>/,
        `${permissionsToAdd}\n</manifest>`
      );
      
      fs.writeFileSync(manifestPath, manifestContent);
      console.log('Added background location permissions to AndroidManifest.xml');
    } else {
      console.log('Background location permissions already exist in AndroidManifest.xml');
    }
  } else {
    console.warn('AndroidManifest.xml not found at', manifestPath);
  }
} catch (error) {
  console.error('Error updating AndroidManifest.xml:', error.message);
}

console.log('\n===== Capacitor Android setup complete =====');
console.log('Next steps:');
console.log('1. Connect an Android device or start an emulator');
console.log('2. Run: npx cap open android');
console.log('3. Build the app in Android Studio');
console.log('4. Or directly run: npx cap run android');
console.log('\nThese steps require Android Studio and Android SDK to be installed on your development machine.');