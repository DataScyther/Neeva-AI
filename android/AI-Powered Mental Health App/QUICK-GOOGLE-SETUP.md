# 🚀 Quick Google OAuth Setup (5 Minutes)

## ⚡ Get Real Google Authentication Working

Your Google sign-in buttons are now **properly implemented** but need **real Google credentials** to connect to actual Gmail accounts.

### 📋 Step-by-Step Setup:

#### 1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

#### 2. **Create New Project** (if needed)
   - Click "Select a project" → "New Project"
   - Name: `Neeva Mental Health`
   - Click "Create"

#### 3. **Enable APIs**
   - Go to "APIs & Services" → "Library"
   - Search and enable: **"Google+ API"** and **"People API"**

#### 4. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   
   **First time?** Configure consent screen:
   - Click "Configure Consent Screen"
   - Choose "External"
   - App name: `Neeva Mental Health`
   - Your email for support
   - Save and continue through all steps

#### 5. **Configure OAuth Client**
   - Application type: **"Web application"**
   - Name: `Neeva Web Client`
   
   **Authorized JavaScript origins:**
   ```
   http://localhost:3002
   ```
   
   **Authorized redirect URIs:**
   ```
   http://localhost:3002/auth/google/callback
   ```
   
   - Click **"Create"**

#### 6. **Copy Your Credentials**
   - Copy the **Client ID** (looks like: `123456-abc.apps.googleusercontent.com`)
   - Copy the **Client Secret** (looks like: `GOCSPX-abc123...`)

#### 7. **Update Your .env File**
   Replace these lines in your `.env` file:
   ```env
   VITE_GOOGLE_CLIENT_ID=paste_your_client_id_here
   GOOGLE_CLIENT_SECRET=paste_your_client_secret_here
   ```

#### 8. **Restart Your App**
   ```bash
   # Stop the dev server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

### ✅ **Test Real Google Authentication**

1. **Open your app**: http://localhost:3002
2. **Click "Continue with Google"**
3. **Google popup should open** → Sign in with any Gmail account
4. **You'll be signed in** with your real Google profile!

### 🔧 **What's Different Now**

- ✅ **Real Google OAuth**: Connects to actual Gmail accounts
- ✅ **Profile Pictures**: Shows your real Google profile photo
- ✅ **Verified Emails**: Gmail email addresses are auto-verified
- ✅ **Secure Tokens**: Real JWT tokens for your sessions
- ✅ **Database Storage**: Google users saved to PostgreSQL

### 🚨 **Common Issues**

**"OAuth client not found"**
- Check your Client ID in `.env` file
- Make sure no extra spaces or quotes

**"Redirect URI mismatch"**
- Ensure redirect URI in Google Console exactly matches: `http://localhost:3002/auth/google/callback`

**"This app isn't verified"**
- Click "Advanced" → "Go to Neeva Mental Health (unsafe)"
- This is normal for development

### 🎯 **After Setup**

Your **Google sign-in buttons** will now:
1. **Open real Google popup**
2. **Connect to actual Gmail accounts**
3. **Import user profiles automatically**
4. **Create accounts in your database**
5. **Provide secure authentication**

**🚀 Ready to test with real Google accounts!**
