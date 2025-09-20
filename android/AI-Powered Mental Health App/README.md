# Neeva - AI-Powered Mental Health App

Neeva is a comprehensive mental health companion app with AI-powered chatbot integration using OpenRouter API and DeepSeek model. Built with React, TypeScript, and Capacitor for cross-platform mobile deployment.

## Features

- **AI Companion**: Chat with Neeva, an intelligent mental health companion powered by DeepSeek AI
- **Mood Tracking**: Track daily moods with insights and analytics  
- **CBT Exercises**: Guided cognitive behavioral therapy exercises
- **Community Support**: Connect with support groups and communities
- **Progress Dashboard**: Visualize your mental health journey
- **Crisis Support**: 24/7 crisis intervention resources
- **Goal Setting**: Set and track wellness goals

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Library**: Radix UI + Tailwind CSS
- **Mobile**: Capacitor for Android/iOS
- **AI Integration**: OpenRouter API with DeepSeek Chat v3.1
- **Backend**: Supabase (optional)
- **Charts**: Recharts for data visualization

## Setup Instructions

### Prerequisites

- Node.js 18+
- Android Studio (for Android builds)
- Java JDK 17+

### Development Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Configure API Keys**:
   Update `.env` file with your OpenRouter API key:

   ```env
   VITE_OPENROUTER_API_KEY=your_api_key_here
   VITE_OPENROUTER_MODEL=deepseek/deepseek-chat-v3.1:free
   VITE_OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
   ```

3. **Start development server**:

   ```bash
   npm run dev
   ```

### Building for Android

1. **Build the web assets**:

   ```bash
   npm run build
   ```

2. **Sync with Capacitor**:

   ```bash
   npx cap sync android
   ```

3. **Open in Android Studio**:

   ```bash
   npx cap open android
   ```

4. **Build APK**:
   - Use Android Studio's Build menu
   - Or use the gradle command from the `android/` directory:

   ```bash
   ./gradlew assembleRelease
   ```

### Quick Android Build Script

```bash
npm run android
```

This runs the complete build pipeline: `build → sync → gradle build`

## Project Structure

```text
├── src/
│   ├── components/          # React components
│   ├── utils/              
│   │   ├── openrouter.ts   # AI API integration
│   │   └── supabase/       # Backend utilities
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── android/                # Android native project
├── capacitor.config.ts     # Capacitor configuration  
└── vite.config.ts         # Vite build configuration
```

## API Integration

The app uses OpenRouter API to connect with DeepSeek's Chat v3.1 model for intelligent mental health conversations. The AI is configured with specialized prompts for:

- Emotional support and active listening
- Evidence-based coping strategies  
- Mindfulness and breathing exercises
- Crisis intervention guidance
- Goal setting and motivation

## Android Configuration

- **App ID**: `com.mentalhealth.app`
- **Target SDK**: 34
- **Min SDK**: 24
- **Signing**: Release builds are signed with `my-release-key.jks`

## Troubleshooting

### Common Issues

1. **Node modules not found**: Run `npm install`
2. **Build errors**: Check that Node.js version is 18+
3. **Android build fails**: Ensure Android Studio and JDK 17+ are installed
4. **API errors**: Verify OpenRouter API key in `.env` file

### Development Tips

- Use `npm run dev` for fast development with hot reload
- Check browser console for API connection issues
- The debug panel (dev only) helps test API integration
- Use Android Studio's logcat for mobile debugging

## License

Private project - All rights reserved