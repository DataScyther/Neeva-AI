# 🚀 Deploy Neeva AI to Vercel - Step-by-Step Guide

**⏰ Time Required**: 5-10 minutes  
**Status**: ✅ All files ready for deployment

---

## 📋 Step 1: Login/Sign Up to Vercel

1. **The Vercel dashboard should now be open in your browser**
2. If not logged in:
   - Click **"Sign Up"** or **"Log In"**
   - Choose **"Continue with GitHub"** (Recommended)
   - Authorize Vercel to access your GitHub account

---

## 📦 Step 2: Import Your Repository

### On the Vercel Dashboard:

1. **Click "Add New..."** (top right) → **"Project"**

2. **Import Git Repository**:
   - You should see: `DataScyther/Neeva-AI`
   - Click **"Import"** button next to it

3. **If you don't see your repository**:
   - Click "Adjust GitHub App Permissions"
   - Select "All Repositories" or specifically select `Neeva-AI`
   - Click "Install & Authorize"

---

## ⚙️ Step 3: Configure Project Settings

Vercel will auto-detect these settings from your `vercel.json`:

### ✅ Auto-Detected Settings:
```
Framework Preset: Vite
Root Directory: ./
Build Command: npm install --legacy-peer-deps && npm run build
Output Directory: dist
Install Command: npm install --legacy-peer-deps
```

### What You Need to Do:
- **Project Name**: Leave as `Neeva-AI` or rename to `neeva-ai`
- **Framework**: Should show "Vite" ✅
- **Don't click Deploy yet!** We need to add environment variables first

---

## 🔐 Step 4: Add Environment Variables (CRITICAL)

### Click on "Environment Variables" section to expand it

**Copy and paste each variable one by one:**

### Firebase Configuration (6 variables):

```
Name: VITE_FIREBASE_API_KEY
Value: AIzaSyArYw_5H4KEXyQKs789SJZjwkHSPnBGe2s
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name: VITE_FIREBASE_AUTH_DOMAIN
Value: neeva-ai.firebaseapp.com
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name: VITE_FIREBASE_PROJECT_ID
Value: neeva-ai
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name: VITE_FIREBASE_STORAGE_BUCKET
Value: neeva-ai.firebasestorage.app
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name: VITE_FIREBASE_MESSAGING_SENDER_ID
Value: 164484584995
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name: VITE_FIREBASE_APP_ID
Value: 1:164484584995:web:neeva-ai-web
Environments: ✅ Production ✅ Preview ✅ Development
```

### Google Gemini AI (3 variables):

```
Name: VITE_GEMINI_API_KEY
Value: AIzaSyDuGk6eephMZOla7-NjvQnuV4NLlHTDuyA
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name: VITE_GEMINI_MODEL
Value: gemini-2.0-flash
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name: VITE_GEMINI_BASE_URL
Value: https://generativelanguage.googleapis.com/v1beta
Environments: ✅ Production ✅ Preview ✅ Development
```

### OpenRouter AI (3 variables):

```
Name: VITE_OPENROUTER_API_KEY
Value: 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
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name: VITE_OPENROUTER_MODEL
Value: deepseek/deepseek-chat-v3.1:free
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name: VITE_OPENROUTER_BASE_URL
Value: https://openrouter.ai/api/v1
Environments: ✅ Production ✅ Preview ✅ Development
```

### 📌 Important Notes:
- **Total Variables**: 12 (6 Firebase + 3 Gemini + 3 OpenRouter)
- **Select all 3 environments** for each variable (Production, Preview, Development)
- **Double-check spelling**: Variable names are case-sensitive!
- **No quotes needed**: Just paste the values as-is

---

## 🚀 Step 5: Deploy!

1. **Verify all settings**:
   - ✅ Project name is set
   - ✅ Framework shows "Vite"
   - ✅ All 12 environment variables added
   - ✅ Build command includes `--legacy-peer-deps`

2. **Click the big blue "Deploy" button**

3. **Watch the build process**:
   - Installing dependencies (~30 seconds)
   - Building application (~1 minute)
   - Uploading (~30 seconds)
   - **Total time: 2-3 minutes**

---

## ⏳ Step 6: Monitor Deployment

### During Build:

You'll see logs like:
```
▲ Installing dependencies...
▲ Running "npm install --legacy-peer-deps"
▲ Running "npm run build"
▲ Build completed
▲ Uploading to Vercel...
▲ Deployment complete!
```

### If Build Succeeds: 🎉
- You'll see: **"Congratulations! Your project has been deployed."**
- You'll get a URL like: `https://neeva-ai.vercel.app` or `https://neeva-ai-xyz123.vercel.app`
- Click **"Visit"** to see your live app!

### If Build Fails: ❌
- Check the build logs for errors
- Common issues:
  - Missing environment variables
  - Dependency conflicts (should be fixed with `--legacy-peer-deps`)
  - TypeScript errors (should be none in v0.2.0)

---

## ✅ Step 7: Post-Deployment Configuration

### 1. Note Your Vercel URL

Your app is now live at something like:
```
https://neeva-ai-xyz123.vercel.app
```

### 2. Configure Firebase (REQUIRED)

**Without this, authentication won't work!**

1. Go to: https://console.firebase.google.com/
2. Select your `neeva-ai` project
3. Navigate to: **Authentication** → **Settings** → **Authorized domains**
4. Click **"Add domain"**
5. Paste your Vercel URL (without https://): `neeva-ai-xyz123.vercel.app`
6. Click **"Add"**

### 3. Test Your Deployment

Visit your Vercel URL and test:

- ✅ **Homepage loads** (should see auth screen)
- ✅ **Sign Up works** (create a test account)
- ✅ **Sign In works** (login with test account)
- ✅ **Forgot Password** (test email reset)
- ✅ **AI Chat responds** (test chatbot)
- ✅ **Mobile view** (test on phone or DevTools)

---

## 🔄 Step 8: Enable Continuous Deployment

**Good news!** This is already set up automatically!

### How it works:

1. **Make changes** to your code locally
2. **Commit and push** to GitHub:
   ```powershell
   git add .
   git commit -m "feat: your changes"
   git push origin main
   ```
3. **Vercel automatically**:
   - Detects the push
   - Runs the build
   - Deploys to production
   - Sends you a notification

### Preview Deployments:

- Every **Pull Request** gets its own preview URL
- Test changes before merging to main
- Perfect for collaboration!

---

## 📊 Step 9: Monitor Your Deployment

### Vercel Dashboard Features:

1. **Deployments**: View all deployments and their status
2. **Analytics**: See page views, performance metrics
3. **Logs**: Real-time and historical logs
4. **Settings**: Update environment variables, domains, etc.

### Access Dashboard:
- Click project name in Vercel dashboard
- Or visit: https://vercel.com/dashboard

---

## 🎯 Optional: Add Custom Domain

### If you have a custom domain:

1. **Vercel Dashboard** → Your Project → **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `myapp.com`)
4. Follow DNS configuration instructions
5. SSL certificate auto-generated (free!)

---

## 🐛 Troubleshooting

### Build Errors:

**"Cannot find module 'rollup/parseAst'"**
- ✅ Fixed in v0.2.0 with Vite 5.4.11

**"Environment variable is undefined"**
- Check all 12 variables are added
- Verify spelling and case-sensitivity
- Restart build after adding variables

**"Firebase auth error"**
- Add Vercel domain to Firebase authorized domains
- Wait 5-10 minutes for Firebase to update

### Runtime Errors:

**"AI not responding"**
- Check Gemini and OpenRouter API keys
- Verify API quotas aren't exceeded
- Check browser console for errors

**"Authentication failed"**
- Verify Firebase domain is authorized
- Check Firebase API keys are correct
- Test with incognito mode (clear cache)

---

## 📱 Next Steps After Deployment

### Share Your App:
1. ✅ Test all features thoroughly
2. ✅ Share Vercel URL with users
3. ✅ Monitor for errors in first 24 hours
4. ✅ Set up custom domain (optional)
5. ✅ Enable analytics (optional)

### Keep Updated:
- Push updates to GitHub → Auto-deploys to Vercel
- Monitor Dependabot alerts for security
- Regular security updates (monthly recommended)

---

## 🎉 Success Checklist

After deployment, you should have:

- [x] Live app at Vercel URL
- [x] All features working (auth, AI chat, etc.)
- [x] Firebase domain authorized
- [x] Mobile responsive
- [x] HTTPS enabled (automatic)
- [x] Auto-deployments configured
- [x] Zero security vulnerabilities (v0.2.0)

---

## 🆘 Need Help?

### Resources:
- **Vercel Docs**: https://vercel.com/docs
- **Firebase Console**: https://console.firebase.google.com/
- **Your GitHub**: https://github.com/DataScyther/Neeva-AI
- **Deployment Guide**: See VERCEL_DEPLOYMENT.md

### Common Questions:

**Q: How long does deployment take?**  
A: 2-3 minutes for first deployment

**Q: Can I change environment variables later?**  
A: Yes! Settings → Environment Variables → Edit → Redeploy

**Q: How much does Vercel cost?**  
A: Free for personal projects! (Hobby plan)

**Q: What if I need to rollback?**  
A: Deployments tab → Previous deployment → Promote to Production

---

## 🚀 You're All Set!

**Current Status**: Ready to deploy! 🎯

**Next Action**: 
1. ✅ Vercel dashboard is open in your browser
2. ✅ Follow steps 1-7 above
3. ✅ Your app will be live in ~5 minutes!

**After deployment, send me your Vercel URL and I'll help verify everything is working!** 🎉

---

**Good luck! Your Neeva AI Mental Health Companion is about to go live! 🌟**
