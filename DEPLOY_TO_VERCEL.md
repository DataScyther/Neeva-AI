# Deploy Neeva AI to Vercel

## Prerequisites
- A Vercel account (sign up at https://vercel.com)
- Git repository (GitHub, GitLab, or Bitbucket)

## Step-by-Step Deployment Guide

### 1. Install Dependencies Locally
```bash
npm install
```

### 2. Test Build Locally
```bash
npm run build
```
This should create a `dist` folder with your production build.

### 3. Push to Git Repository
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 4. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy
vercel

# Follow the prompts
```

#### Option B: Using Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will auto-detect Vite framework
5. Configure environment variables (see below)
6. Click "Deploy"

### 5. Configure Environment Variables in Vercel

Go to your project settings in Vercel and add these environment variables:

```
VITE_FIREBASE_API_KEY=AIzaSyArYw_5H4KEXyQKs789SJZjwkHSPnBGe2s
VITE_FIREBASE_AUTH_DOMAIN=neeva-ai.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=neeva-ai
VITE_FIREBASE_STORAGE_BUCKET=neeva-ai.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=164484584995
VITE_FIREBASE_APP_ID=1:164484584995:web:neeva-ai-web

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

VITE_OPENROUTER_API_KEY=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
VITE_OPENROUTER_MODEL=deepseek/deepseek-chat-v3.1:free
VITE_OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

VITE_GEMINI_API_KEY=AIzaSyCTwOt4YHmK0qrQigN_P3hvRspJ-zUNX2I
VITE_GEMINI_MODEL=gemini-1.0-pro
VITE_GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
```

### 6. Custom Domain (Optional)
1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

### Build Errors
If you encounter build errors:
1. Ensure all dependencies are installed: `npm install`
2. Clear node_modules and reinstall: 
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. Check TypeScript errors: `npx tsc --noEmit`

### Environment Variables Not Working
- Make sure all variables start with `VITE_`
- Redeploy after adding/changing environment variables
- Check the Vercel function logs for errors

### 502 Bad Gateway
- Check if all API endpoints are correctly configured
- Verify Firebase and Supabase configurations
- Review Vercel function logs

## Production Checklist
- [ ] All environment variables configured
- [ ] Build succeeds locally
- [ ] Firebase authentication configured for production domain
- [ ] Supabase CORS settings updated for production domain
- [ ] API keys are production-ready (not test keys)
- [ ] Error tracking configured (optional)
- [ ] Analytics configured (optional)

## Support
For issues specific to:
- Vercel deployment: https://vercel.com/docs
- Vite configuration: https://vitejs.dev/guide/
- Firebase: https://firebase.google.com/docs
- Supabase: https://supabase.com/docs
