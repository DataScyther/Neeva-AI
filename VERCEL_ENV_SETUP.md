# 🔐 Vercel Environment Variables Setup - UPDATED

**Date**: October 1, 2025  
**API Updated**: xAI Grok 4 Fast (2M context, Free tier)  
**Status**: ✅ Ready for Production

---

## 🚀 **CRITICAL: Set These in Vercel Dashboard**

### **Go to**: https://vercel.com/dashboard
1. **Select your project**: neeva-ai
2. **Settings** → **Environment Variables**
3. **Add each variable below**
4. **Select**: ✅ Production ✅ Preview ✅ Development

---

## 📋 **Environment Variables (12 Total)**

### **Firebase Authentication (6 variables)**

```bash
VITE_FIREBASE_API_KEY=AIzaSyArYw_5H4KEXyQKs789SJZjwkHSPnBGe2s
```

```bash
VITE_FIREBASE_AUTH_DOMAIN=neeva-ai.firebaseapp.com
```

```bash
VITE_FIREBASE_PROJECT_ID=neeva-ai
```

```bash
VITE_FIREBASE_STORAGE_BUCKET=neeva-ai.firebasestorage.app
```

```bash
VITE_FIREBASE_MESSAGING_SENDER_ID=164484584995
```

```bash
VITE_FIREBASE_APP_ID=1:164484584995:web:neeva-ai-web
```

---

### **Google Gemini AI (3 variables) - Primary AI**

```bash
VITE_GEMINI_API_KEY=AIzaSyDuGk6eephMZOla7-NjvQnuV4NLlHTDuyA
```

```bash
VITE_GEMINI_MODEL=gemini-2.0-flash
```

```bash
VITE_GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
```

---

### **🆕 xAI Grok 4 Fast (3 variables) - Fallback AI**

```bash
VITE_OPENROUTER_API_KEY=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
```

```bash
VITE_OPENROUTER_MODEL=x-ai/grok-4-fast:free
```

```bash
VITE_OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

---

## 🎯 **xAI Grok 4 Fast Features**

### **Why This Model?**
- ✅ **2,000,000 context tokens** (massive context window)
- ✅ **Free tier** with generous limits
- ✅ **Fast responses** optimized for speed
- ✅ **High quality** AI responses
- ✅ **No rate limits** on free tier (unlike Gemini)

### **Specifications**:
| Feature | Value |
|---------|-------|
| **Model** | x-ai/grok-4-fast:free |
| **Context** | 2,000,000 tokens |
| **Input Cost** | $0/M tokens (FREE) |
| **Output Cost** | $0/M tokens (FREE) |
| **Rate Limit** | Much higher than Gemini |
| **Created** | Sep 19, 2025 |

---

## 🔄 **How It Works**

### **AI Fallback System**:
1. **Primary**: Gemini API (gemini-2.0-flash)
2. **Fallback**: xAI Grok 4 Fast (when Gemini rate-limited)
3. **Automatic**: Switches seamlessly between them

### **When Grok is Used**:
- ✅ When Gemini hits rate limit (60 req/min)
- ✅ When Gemini API fails
- ✅ Provides uninterrupted service
- ✅ Better context handling (2M vs 1M tokens)

---

## 📊 **Comparison**

| Feature | Gemini 2.0 Flash | xAI Grok 4 Fast |
|---------|------------------|-----------------|
| **Context** | 1M tokens | 2M tokens ✅ |
| **Rate Limit** | 60/min | Higher ✅ |
| **Free Tier** | 1500/day | More generous ✅ |
| **Speed** | Fast | Very Fast ✅ |
| **Quality** | Excellent | Excellent ✅ |

---

## ✅ **Setup Instructions**

### **Step 1: Access Vercel Dashboard**
1. Go to: https://vercel.com/dashboard
2. Click on your **neeva-ai** project
3. Navigate to: **Settings** → **Environment Variables**

### **Step 2: Add Variables**
For each of the 12 variables above:

1. **Click "Add"** or "Add Another"
2. **Name**: Copy variable name exactly (e.g., `VITE_FIREBASE_API_KEY`)
3. **Value**: Copy the value exactly
4. **Environments**: Select all three:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. **Click "Save"**

### **Step 3: Redeploy**
After adding all variables:
1. Go to **Deployments** tab
2. Click **"Redeploy"** on latest deployment
3. Or push new commit to trigger auto-deployment

---

## 🧪 **Testing**

### **After Deployment**:
1. **Visit your live URL**
2. **Test AI Chat**:
   - Send a message
   - Should get response from Gemini or Grok
   - Check browser console for which API is used

### **Test Fallback**:
1. Send multiple messages quickly
2. When Gemini rate-limits, Grok takes over
3. No interruption in service

### **Verify in Console**:
```javascript
// Check which API responded
// Look for: "Using Gemini API" or "Using OpenRouter (Grok)"
```

---

## 🔐 **Security Notes**

### **API Key Safety**:
- ✅ **Never commit** .env file to Git
- ✅ **Use .env.example** for templates
- ✅ **Vercel encrypts** environment variables
- ✅ **Rotate keys** if exposed

### **Best Practices**:
- Keep API keys in Vercel dashboard only
- Use different keys for dev/prod if needed
- Monitor usage in respective dashboards
- Set up alerts for unusual activity

---

## 📈 **Monitoring**

### **Gemini API**:
- **Dashboard**: https://aistudio.google.com/
- **Check**: Request count, rate limits
- **Quota**: 60 requests/minute, 1500/day

### **xAI Grok (OpenRouter)**:
- **Dashboard**: https://openrouter.ai/
- **Check**: Usage, credits, rate limits
- **Quota**: More generous than Gemini

---

## 🚨 **Troubleshooting**

### **If AI Not Responding**:
1. **Check Vercel logs** for errors
2. **Verify all 12 variables** are set
3. **Check API keys** are valid
4. **Test in browser console**

### **If Rate Limited**:
- ✅ **Grok should auto-activate** as fallback
- ✅ **Wait 60 seconds** for Gemini reset
- ✅ **Check console** for fallback messages

### **If Variables Not Loading**:
1. **Redeploy** after adding variables
2. **Check spelling** of variable names
3. **Verify environments** are selected
4. **Clear browser cache**

---

## ✅ **Verification Checklist**

After setup, verify:

- [ ] All 12 environment variables added in Vercel
- [ ] All variables have all 3 environments checked
- [ ] Deployment successful (no build errors)
- [ ] AI chat responds to messages
- [ ] Fallback works when rate-limited
- [ ] No console errors in browser
- [ ] Firebase authentication works
- [ ] Mobile responsive design working

---

## 🎉 **Benefits of This Setup**

### **Reliability**:
- ✅ **Dual AI system** prevents downtime
- ✅ **Automatic fallback** seamless for users
- ✅ **Higher limits** with Grok backup

### **Performance**:
- ✅ **2M context** for longer conversations
- ✅ **Fast responses** from both APIs
- ✅ **No interruptions** during rate limits

### **Cost**:
- ✅ **100% Free** for both APIs
- ✅ **No credit card** required
- ✅ **Generous quotas** for production use

---

## 📞 **Support**

### **Resources**:
- **Vercel Docs**: https://vercel.com/docs/environment-variables
- **Gemini API**: https://ai.google.dev/
- **OpenRouter**: https://openrouter.ai/docs
- **xAI Grok**: https://openrouter.ai/models/x-ai/grok-4-fast

---

## 🎯 **Quick Copy-Paste**

### **All Variables (for quick setup)**:

```bash
# Firebase (6)
VITE_FIREBASE_API_KEY=AIzaSyArYw_5H4KEXyQKs789SJZjwkHSPnBGe2s
VITE_FIREBASE_AUTH_DOMAIN=neeva-ai.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=neeva-ai
VITE_FIREBASE_STORAGE_BUCKET=neeva-ai.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=164484584995
VITE_FIREBASE_APP_ID=1:164484584995:web:neeva-ai-web

# Gemini (3)
VITE_GEMINI_API_KEY=AIzaSyDuGk6eephMZOla7-NjvQnuV4NLlHTDuyA
VITE_GEMINI_MODEL=gemini-2.0-flash
VITE_GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta

# xAI Grok 4 Fast (3)
VITE_OPENROUTER_API_KEY=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
VITE_OPENROUTER_MODEL=x-ai/grok-4-fast:free
VITE_OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

---

**🚀 Your Neeva AI app now has enterprise-grade AI with 2M context and automatic fallback!**

**Set these variables in Vercel and redeploy for the update to take effect!** ✅
