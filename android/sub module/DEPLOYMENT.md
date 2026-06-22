# 🚀 Neeva Mental Health App - Deployment Guide

## ✅ Pre-Deployment Checklist

### Environment Setup

- [ ] **Node.js 18+** installed
- [ ] **Android Studio** with SDK installed
- [ ] **Java JDK 17+** configured
- [ ] **Android device** connected with USB debugging enabled

### Project Validation

- [ ] Dependencies installed: `npm install`
- [ ] Environment configured: `.env` file with OpenRouter API key
- [ ] Build validation passes: `npm run validate`
- [ ] No TypeScript/lint errors

## 🔧 Build Commands

### Quick Debug Build

```bash
# Validate, build, and sync for debugging
npm run android:debug
```

### Production Release Build

```bash
# Full production build with release signing
npm run android
```

### Manual Step-by-Step

```bash
# 1. Install dependencies
npm install

# 2. Validate configuration
npm run validate

# 3. Build React app
npm run build

# 4. Sync with Capacitor
npx cap sync android

# 5. Open in Android Studio
npx cap open android

# 6. Build APK in Android Studio or via Gradle
cd ../../../android
./gradlew assembleRelease  # or assembleDebug
```

## 📱 APK Output Locations

### Debug APK

- **Path**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **App ID**: `com.mentalhealth.app.debug`
- **Features**: Debugging enabled, console logs visible

### Release APK

- **Path**: `android/app/build/outputs/apk/release/AI Mental Wellness App.apk`
- **App ID**: `com.mentalhealth.app`
- **Features**: Optimized, signed for distribution

## 🐛 Debug vs Release Comparison

| Feature | Debug Build | Release Build |
|---------|-------------|---------------|
| **Debuggable** | ✅ Yes | ❌ No |
| **Console Logs** | ✅ Visible | ⚠️ Limited |
| **Chrome DevTools** | ✅ Full access | ❌ Restricted |
| **APK Size** | 📦 Larger | 📦 Optimized |
| **Performance** | 🐌 Slower | 🚀 Optimized |
| **Installation** | 📱 Side by side | 📱 Replace only |

## 🎯 Key Features Included

### ✨ AI Companion

- **OpenRouter Integration**: DeepSeek Chat v3.1 model
- **Intelligent Responses**: Mental health focused conversations
- **Error Handling**: Graceful fallbacks if API fails
- **Privacy**: Local chat history storage

### 📊 Mental Health Tools

- **Mood Tracking**: Daily mood logging with analytics
- **CBT Exercises**: Guided cognitive behavioral therapy
- **Meditation**: Guided mindfulness sessions
- **Crisis Support**: 24/7 emergency resources
- **Community**: Support group connections

### 🔧 Technical Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Radix UI + Tailwind CSS
- **Mobile**: Capacitor 6 for native features
- **Charts**: Recharts for data visualization
- **Backend**: Supabase integration ready

## 🚨 Pre-Launch Testing

### Functional Testing

- [ ] **AI Chat**: Test OpenRouter API responses
- [ ] **Mood Tracking**: Log and view mood entries
- [ ] **Navigation**: All screens accessible
- [ ] **Offline Mode**: App works without internet
- [ ] **Responsive**: UI adapts to different screen sizes

### Performance Testing

- [ ] **App Launch**: Opens within 3 seconds
- [ ] **API Calls**: Reasonable response times
- [ ] **Memory Usage**: No memory leaks
- [ ] **Battery Impact**: Optimized for mobile

### Device Testing

- [ ] **Android 7+**: Minimum API level 24
- [ ] **Different Screen Sizes**: Phones and tablets
- [ ] **Orientations**: Portrait and landscape
- [ ] **Permissions**: Required permissions granted

## 🔐 Security Considerations

### API Security

- ✅ **Environment Variables**: API keys not hardcoded
- ✅ **HTTPS Only**: All API calls encrypted
- ✅ **Error Handling**: No sensitive data in error messages

### App Security

- ✅ **Signed APK**: Release builds properly signed
- ✅ **Obfuscation**: Code minified in release
- ✅ **Permissions**: Minimal required permissions

## 📋 Distribution Checklist

### Google Play Store (Future)

- [ ] **App Signing**: Configure Play App Signing
- [ ] **Store Listing**: Screenshots, description, keywords
- [ ] **Content Rating**: Mental health app classification
- [ ] **Privacy Policy**: Required for health apps
- [ ] **Target Audience**: 13+ age rating

### Direct Distribution (Current)

- [x] **APK Signed**: Ready for sideloading
- [x] **Installation Guide**: User instructions
- [x] **Debug Info**: Debugging capabilities enabled

## 🛠️ Troubleshooting

### Common Build Issues

1. **Gradle Build Fails**: Run `./gradlew clean` first
2. **API Key Missing**: Check `.env` file configuration
3. **Dependencies**: Run `npm install` and sync Android project
4. **Signing**: Ensure `my-release-key.jks` exists

### Runtime Issues

1. **API Not Working**: Verify OpenRouter key and internet
2. **App Crashes**: Check Android Logcat for errors
3. **UI Issues**: Test on different devices/orientations

## 📞 Support & Documentation

- **Setup Guide**: [README.md](./README.md)
- **Debug Guide**: [DEBUG.md](./DEBUG.md)
- **Build Validation**: `npm run validate`
- **Issue Tracking**: Check Android Studio Logcat

---

## 🎉 Deployment Success

Your **Neeva Mental Health App** is ready for deployment with:

- ✅ **AI-Powered Conversations** via OpenRouter
- ✅ **Comprehensive Mental Health Tools**
- ✅ **Production-Ready Android APK**
- ✅ **Debug Capabilities Enabled**
- ✅ **Professional UI/UX Design**

**Next Steps**: Install the APK on your device and start helping users improve their mental wellness! 🌟
