# Debug Guide for Neeva Mental Health App

## Prerequisites for Debugging

### Required Software

- ✅ **Android Studio** (latest version)
- ✅ **Node.js 18+**
- ✅ **Java JDK 17+**
- ✅ **Android SDK** (API 34+)
- ✅ **USB Debugging enabled** on your Android device

### Environment Setup

1. Enable Developer Options on your Android device:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Enable "USB Debugging" in Developer Options

2. Install ADB (Android Debug Bridge):

   ```bash
   # Check if ADB is available
   adb version
   
   # List connected devices
   adb devices
   ```

## Debug Build Process

### Step 1: Install Dependencies

```bash
cd "AI-Powered Mental Health App"
npm install
```

### Step 2: Build for Debug

```bash
# Build React app and sync with Capacitor
npm run android:debug
```

### Step 3: Open Android Studio

```bash
# Open the Android project in Android Studio
npx cap open android
```

### Step 4: Debug APK Build Options

#### Option A: Debug APK via Android Studio

1. In Android Studio:
   - Build → Select Build Variant → **debug**
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
   - APK will be in: `android/app/build/outputs/apk/debug/`

#### Option B: Debug APK via Gradle Command

```bash
# From the android/ directory
cd ../../../android
./gradlew assembleDebug
```

#### Option C: Install and Run on Device

```bash
# Install debug APK directly to connected device
./gradlew installDebug

# Or run the app directly
npx cap run android
```

## Debugging Features

### 1. Browser DevTools (Chrome Remote Debugging)

1. Connect your Android device via USB
2. Open Chrome and navigate to: `chrome://inspect`
3. Your app should appear under "Remote Target"
4. Click "Inspect" to open DevTools

### 2. Android Logcat

```bash
# View app logs in real-time
adb logcat | grep "MentalHealth"

# Or in Android Studio:
# View → Tool Windows → Logcat
```

### 3. Network Debugging

- OpenRouter API calls are logged in console
- Check Network tab in Chrome DevTools
- Verify API key in environment variables

### 4. React DevTools

Install React DevTools for debugging React components:

```bash
npm install -g react-devtools
react-devtools
```

## Debug Configuration

### Debug vs Release Builds

- **Debug Build**: `com.mentalhealth.app.debug`
- **Release Build**: `com.mentalhealth.app`
- Both can be installed simultaneously

### Debug APK Features

- ✅ **Debuggable**: Full debugging capabilities
- ✅ **Unminified**: Readable code and logs  
- ✅ **Source Maps**: Original TypeScript/React code
- ✅ **Hot Reload**: Live code updates (dev server)
- ✅ **Console Logs**: All console.log statements visible

## Common Debug Issues & Solutions

### 1. API Connection Issues

**Problem**: OpenRouter API not responding

**Debug Steps**:

```javascript
// Check in browser console
console.log('API Key:', import.meta.env.VITE_OPENROUTER_API_KEY);
console.log('API URL:', import.meta.env.VITE_OPENROUTER_BASE_URL);
```

**Solution**: Verify `.env` file and API key validity

### 2. Build Failures

**Problem**: Gradle build fails

**Debug Steps**:

```bash
# Clean build
./gradlew clean

# Build with detailed logs
./gradlew assembleDebug --info --debug
```

### 3. Device Not Detected

**Problem**: Android device not visible

**Debug Steps**:

```bash
# Restart ADB
adb kill-server
adb start-server

# Check USB debugging
adb devices
```

### 4. App Crashes

**Debug Steps**:

1. Check Android Logcat
2. Look for JavaScript errors in Chrome DevTools
3. Check Capacitor native bridge logs

## Performance Debugging

### 1. React Performance

- Use React DevTools Profiler
- Monitor component re-renders
- Check for memory leaks

### 2. Mobile Performance

- Monitor battery usage
- Check CPU and memory usage in Android Studio
- Profile network requests

### 3. AI API Performance

- Monitor API response times
- Check for rate limiting
- Implement proper error handling

## Debug Build Commands Reference

```bash
# Quick debug build
npm run android:debug

# Full debug build with Gradle
npm run build && npx cap sync android && cd ../../../android && ./gradlew assembleDebug

# Run on device with live reload
npx cap run android --livereload --external

# Open Android Studio
npx cap open android

# Check Capacitor status
npx cap doctor

# View app logs
adb logcat | grep -i "capacitor\|console\|error"
```

## Debugging Checklist

### Pre-Debug

- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured (`.env`)
- [ ] Android device connected and detected
- [ ] USB debugging enabled

### During Debug

- [ ] Console logs visible in Chrome DevTools
- [ ] Network requests appearing in DevTools
- [ ] Android Logcat showing app logs
- [ ] No TypeScript compilation errors

### Post-Debug

- [ ] APK installs successfully
- [ ] All features functional
- [ ] API integration working
- [ ] No memory leaks or performance issues

## Debug APK Output Locations

- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: `android/app/build/outputs/apk/release/AI Mental Wellness App.apk`
- **Logs**: Android Studio Logcat or `adb logcat`
- **Source Maps**: Available in debug builds for error tracing

---

**Happy Debugging!** 🐛🔧

For additional help, check the [main README.md](./README.md) for complete setup instructions.
