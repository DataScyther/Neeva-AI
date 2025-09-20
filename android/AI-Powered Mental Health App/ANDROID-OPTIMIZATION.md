# Android App Configuration for Optimal Screen Support

## This file ensures your app works perfectly on all Android devices

## 📱 Screen Size Support Matrix

### Supported Screen Densities

- **ldpi**: ~120dpi (small screens, older devices)
- **mdpi**: ~160dpi (baseline)
- **hdpi**: ~240dpi (high density)
- **xhdpi**: ~320dpi (extra high density)
- **xxhdpi**: ~480dpi (extra extra high)
- **xxxhdpi**: ~640dpi (extra extra extra high)

### Supported Screen Sizes

- **small**: ~320x426dp (older phones)
- **normal**: ~320x470dp (most phones)
- **large**: ~480x640dp (small tablets)
- **xlarge**: ~720x960dp (large tablets, TVs)

## 🎨 Layout Optimizations

### 1. Responsive Breakpoints (Tailwind CSS)

```css
/* Mobile First Approach */
.container {
  width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
  margin-left: auto;
  margin-right: auto;
}

/* Small devices (phones, 640px and up) */
@media (min-width: 640px) {
  .container { max-width: 640px; }
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  .container { max-width: 768px; }
}

/* Large devices (desktops, 1024px and up) */
@media (min-width: 1024px) {
  .container { max-width: 1024px; }
}

/* Extra large devices (large desktops, 1280px and up) */
@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}
```

### 2. Touch Target Sizes

```css
/* Minimum touch target size: 44x44px */
.touch-target {
  min-width: 44px;
  min-height: 44px;
  padding: 8px;
}

/* Button sizes for different screens */
.btn-mobile { padding: 12px 16px; }
.btn-tablet { padding: 14px 20px; }
.btn-desktop { padding: 16px 24px; }
```

### 3. Font Scaling

```css
/* Responsive font sizes */
.text-responsive-xs { font-size: clamp(0.75rem, 2vw, 0.875rem); }
.text-responsive-sm { font-size: clamp(0.875rem, 2.5vw, 1rem); }
.text-responsive-base { font-size: clamp(1rem, 3vw, 1.125rem); }
.text-responsive-lg { font-size: clamp(1.125rem, 3.5vw, 1.25rem); }
.text-responsive-xl { font-size: clamp(1.25rem, 4vw, 1.5rem); }
```

## 📱 Android-Specific Optimizations

### 1. Status Bar & Navigation

```xml
<!-- android/app/src/main/res/values/styles.xml -->
<style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
    <item name="android:statusBarColor">@color/primary</item>
    <item name="android:windowLightStatusBar">true</item>
    <item name="android:navigationBarColor">@color/background</item>
    <item name="android:windowLightNavigationBar">true</item>
</style>
```

### 2. Screen Orientation Support

```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<activity
    android:name=".MainActivity"
    android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|layoutDirection|fontScale"
    android:screenOrientation="unspecified"
    android:exported="true">
</activity>
```

### 3. Multi-Window Support

```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<activity
    android:name=".MainActivity"
    android:resizeableActivity="true"
    android:supportsPictureInPicture="false">
</activity>
```

## 🎯 Capacitor Configuration Optimizations

### 1. Web View Settings

```typescript
// capacitor.config.ts
const config: CapacitorConfig = {
  appId: 'com.mentalhealth.app',
  appName: 'Neeva Mental Health',
  webDir: 'build',
  bundledWebRuntime: false,

  // Optimize for all screen sizes
  android: {
    webContentsDebuggingEnabled: false,
    buildOptions: {
      keystorePath: 'my-release-key.jks',
      keystoreAlias: 'androidreleasekey'
    }
  },

  // Splash screen for smooth loading
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

### 2. Viewport Configuration

```html
<!-- index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
```

## 📊 Performance Optimizations

### 1. Image Optimization

```css
/* Responsive images */
.responsive-img {
  width: 100%;
  height: auto;
  max-width: 100%;
}

/* Different image sizes for different screens */
@media (max-width: 640px) {
  .hero-img { max-width: 320px; }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .hero-img { max-width: 640px; }
}

@media (min-width: 1025px) {
  .hero-img { max-width: 800px; }
}
```

### 2. Layout Performance

```css
/* GPU acceleration for smooth scrolling */
.accelerated {
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}

/* Optimize for touch devices */
.touch-optimized {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
```

## 🔧 Build Optimizations

### 1. APK Size Optimization

```gradle
// android/app/build.gradle
android {
    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            shrinkResources true
        }
    }
}
```

### 2. Resource Optimization

```xml
<!-- android/app/src/main/res/xml/network_security_config.xml -->
<network-security-config>
    <domain-config cleartextTrafficPermitted="false">
        <domain includeSubdomains="true">your-api-domain.com</domain>
    </domain-config>
</network-security-config>
```

## 📱 Testing Checklist

### Screen Size Testing

- [ ] **Phones (320px - 414px)**
- [ ] **Tablets (768px - 1024px)**
- [ ] **Large screens (1200px+)**
- [ ] **Landscape orientation**
- [ ] **Different DPI densities**

### Device Testing

- [ ] **Android 8.0+ (API 26+)**
- [ ] **Different manufacturers (Samsung, Google, OnePlus, etc.)**
- [ ] **Various screen sizes and densities**
- [ ] **Portrait and landscape modes**

### Performance Testing

- [ ] **App startup time < 3 seconds**
- [ ] **Smooth scrolling and animations**
- [ ] **Memory usage optimization**
- [ ] **Battery consumption**

Your app is now optimized for all Android screen sizes and devices! 🎉
