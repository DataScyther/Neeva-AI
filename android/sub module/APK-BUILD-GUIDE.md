# Android APK Build Guide for Neeva Mental Health App

## 🚀 Quick APK Generation Steps

### Step 1: Prerequisites Check
Make sure you have these installed:
- ✅ Node.js (v18+)
- ✅ Java JDK (v11+)
- ✅ Android Studio / Android SDK
- ✅ Capacitor CLI

### Step 2: Environment Setup
```bash
# Check Java version
java -version

# Check Android SDK (if installed)
echo $ANDROID_SDK_ROOT

# Check Node version
node --version
```

### Step 3: Build Commands
```bash
# 1. Install dependencies
npm install

# 2. Build the web app
npm run build

# 3. Add Android platform
npx cap add android

# 4. Sync web assets to Android
npx cap sync android

# 5. Open Android Studio
npx cap open android

# 6. Build APK in Android Studio:
# Build → Build Bundle(s)/APK(s) → Build APK(s)
```

## 📱 APK Optimization for All Screen Sizes

### 1. Responsive Design Configuration
The app is already optimized with:
- ✅ Tailwind CSS responsive classes
- ✅ Mobile-first design approach
- ✅ Flexible layouts with proper breakpoints

### 2. Android Manifest Configuration
```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.mentalhealth.app">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/AppTheme">

        <activity
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale"
            android:label="@string/title_activity_main"
            android:launchMode="singleTask"
            android:name=".MainActivity"
            android:theme="@style/AppTheme.NoActionBarLaunch"
            android:exported="true">

            <intent-filter android:label="@string/title_activity_main">
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

### 3. Screen Size Support
The app supports all screen sizes:
- 📱 **Phones**: 320px - 414px width
- 📱 **Tablets**: 768px - 1024px width
- 📺 **Large screens**: 1200px+ width
- 📱 **Orientation**: Portrait and landscape

### 4. Capacitor Configuration for Screens
```typescript
// capacitor.config.ts
const config: CapacitorConfig = {
  appId: 'com.mentalhealth.app',
  appName: 'Neeva Mental Health',
  webDir: 'build',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePath: 'my-release-key.jks',
      keystoreAlias: 'androidreleasekey'
    }
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#667eea",
      androidSplashResourceName: "splash",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};
```

## 🎯 Build Optimization Features

### 1. **Performance Optimizations**
- ✅ Code splitting with Vite
- ✅ Tree shaking for unused code
- ✅ Optimized images and assets
- ✅ Lazy loading components
- ✅ Service worker caching

### 2. **Mobile-Specific Features**
- ✅ Touch gestures support
- ✅ Swipe navigation
- ✅ Pull-to-refresh
- ✅ Offline functionality
- ✅ Push notifications (ready)

### 3. **Cross-Platform Compatibility**
- ✅ iOS support (Capacitor)
- ✅ Android support (current build)
- ✅ Web PWA support
- ✅ Desktop support (Electron ready)

## 📦 APK Generation Commands

### Debug APK (for testing)
```bash
npm run build
npx cap sync android
npx cap run android  # Opens in emulator/device
```

### Release APK (for production)
```bash
npm run build
npx cap sync android

# In Android Studio:
# 1. Build → Generate Signed Bundle/APK
# 2. Choose APK
# 3. Create new keystore or use existing
# 4. Select release build variant
# 5. Build APK
```

## 🔧 Troubleshooting

### Common Issues:
1. **Java not found**: Install JDK 11+ and set JAVA_HOME
2. **Android SDK not found**: Install Android Studio
3. **Gradle build fails**: Update Android Gradle Plugin
4. **Capacitor sync fails**: Check internet connection

### Build Optimization Tips:
- Use ProGuard for code obfuscation
- Enable R8 compiler for better compression
- Optimize images before building
- Test on multiple devices/emulators

## 📱 Final APK Features

✅ **Universal Screen Support**
- All Android phone sizes (small to large)
- Tablet optimization
- Landscape and portrait modes
- High DPI display support

✅ **Performance Optimized**
- Fast loading times
- Smooth animations
- Low battery usage
- Background sync support

✅ **User Experience**
- Native Android feel
- Offline functionality
- Push notification ready
- Secure authentication

Your APK will be optimized for all mobile screens and ready for Google Play Store submission!
