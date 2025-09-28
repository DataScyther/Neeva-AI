# 🚀 Deploy Neeva AI to Vercel - Complete Guide

## Step 1: Deploy via GitHub Integration

### Option A: Use the Import Link (Recommended)
1. **Click this link**: https://vercel.com/new/import?buildCommand=npm%20install%20--legacy-peer-deps%20%26%26%20npm%20run%20build&framework=vite&hasTrialAvailable=1&outputDirectory=dist&project-name=neeva-ai&remainingProjects=1&s=https%3A%2F%2Fgithub.com%2FDataScyther%2FNeeva-AI&teamSlug=datascythers-projects&totalProjects=1

2. **Vercel will auto-detect** your repository settings:
   - ✅ Framework: Vite
   - ✅ Build Command: `npm install --legacy-peer-deps && npm run build`
   - ✅ Output Directory: `dist`
   - ✅ Root Directory: `./` (project root)

### Option B: Manual Setup
1. Go to https://vercel.com/new?teamSlug=datascythers-projects
2. Click **"Import Git Repository"**
3. Connect your GitHub account
4. Select `DataScyther/Neeva-AI` repository
5. **Configure Build Settings**:
   - Framework: **Vite**
   - Root Directory: `./`
   - Build Command: `npm install --legacy-peer-deps && npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install --legacy-peer-deps`

## Step 2: Configure Environment Variables

After importing, go to your project settings and add these environment variables:

### Required Variables:

```
# Firebase Configuration (Required for Authentication)
VITE_FIREBASE_API_KEY=AIzaSyArYw_5H4KEXyQKs789SJZjwkHSPnBGe2s
VITE_FIREBASE_AUTH_DOMAIN=neeva-ai.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=neeva-ai
VITE_FIREBASE_STORAGE_BUCKET=neeva-ai.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=164484584995
VITE_FIREBASE_APP_ID=1:164484584995:web:neeva-ai-web

# Supabase Configuration (Optional - for future database features)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenRouter AI Configuration (Required for Chat)
VITE_OPENROUTER_API_KEY=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
VITE_OPENROUTER_MODEL=deepseek/deepseek-chat-v3.1:free
VITE_OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Gemini AI Configuration (Optional - fallback)
VITE_GEMINI_API_KEY=AIzaSyCTwOt4YHmK0qrQigN_P3hvRspJ-zUNX2I
VITE_GEMINI_MODEL=gemini-1.0-pro
VITE_GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
```

### How to Get Environment Variables

#### Firebase
1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Select your `neeva-ai` project
3. Go to **Project Settings** → **General** → **Your apps**
4. Scroll down to **SDK setup and configuration**
5. Copy the `firebaseConfig` object values

#### Supabase
*Note: Supabase is currently optional and not actively used in the app. You can skip this for now.*

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy **Project URL** and **anon/public** key

#### OpenRouter

## Step 3: Deploy

1. **Click "Deploy"** in Vercel
2. **Wait for build** (should take 1-2 minutes)
3. **Check build logs** if there are any errors
4. **Visit your live site** once deployment completes!

## Step 4: Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

## Troubleshooting

### Build Errors:
- **Dependency conflicts**: Already handled with `--legacy-peer-deps`
- **Missing environment variables**: Double-check all variables are set
- **Port issues**: Not applicable for Vercel (serverless)

### Runtime Errors:
- **Firebase auth**: Ensure Firebase project allows your Vercel domain
- **Supabase CORS**: Add your Vercel domain to Supabase CORS settings
- **API rate limits**: Monitor usage on OpenRouter dashboard

### Performance:
- Your app is optimized for production
- All bundles are code-split and optimized
- Images and assets are properly handled

## What's Deployed:

✅ **Complete Mental Health App**
- AI Chat with DeepSeek model
- Mood tracking and analytics
- CBT exercises and meditation
- Crisis support resources
- User authentication (Google + Email)
- Responsive design (mobile + desktop)
- Dark/light theme support

## Support:

- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repository**: https://github.com/DataScyther/Neeva-AI
- **Firebase Console**: https://console.firebase.google.com/
- **Supabase Dashboard**: https://supabase.com/dashboard

---

**🎉 Your Neeva AI Mental Health Companion is now live on Vercel!**

*Share your app URL with users who need mental health support!*
