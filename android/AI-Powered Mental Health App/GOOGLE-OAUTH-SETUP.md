# 🔐 Google OAuth Setup Guide for Neeva Mental Health App

## Overview

This guide will help you set up Google OAuth authentication for your Neeva Mental Health App, enabling users to sign in and sign up using their Google accounts.

## ✅ What's Already Configured

Your app already includes:
- ✅ **Google OAuth Dependencies**: All necessary packages installed
- ✅ **Database Schema**: OAuth support added to PostgreSQL
- ✅ **Authentication UI**: Google sign-in buttons in both Sign In and Sign Up tabs
- ✅ **Backend Integration**: Complete OAuth flow implementation
- ✅ **Security**: JWT token generation and refresh token support

## 🎯 Google Cloud Console Setup

### Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**:
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create New Project**:
   - Click "Select a project" → "New Project"
   - Project name: `Neeva Mental Health App`
   - Click "Create"

### Step 2: Enable Google+ API

1. **Navigate to APIs & Services**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

2. **Enable People API** (for user info):
   - Search for "People API"
   - Click "Enable"

### Step 3: Create OAuth 2.0 Credentials

1. **Go to Credentials**:
   - Navigate to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"

2. **Configure OAuth Consent Screen**:
   - Click "Configure Consent Screen"
   - Choose "External" for user type
   - Fill in required information:
     - **App name**: `Neeva Mental Health App`
     - **User support email**: Your email
     - **Developer contact**: Your email
   - Add scopes: `email`, `profile`, `openid`
   - Click "Save and Continue"

3. **Create OAuth Client ID**:
   - Application type: "Web application"
   - Name: "Neeva Mental Health Web Client"
   - **Authorized JavaScript origins**:
     ```
     http://localhost:5173
     http://localhost:3000
     https://your-domain.com (for production)
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:5173/auth/google/callback
     http://localhost:3000/auth/google/callback
     https://your-domain.com/auth/google/callback
     ```
   - Click "Create"

4. **Save Credentials**:
   - Copy the **Client ID** and **Client Secret**
   - Keep these secure!

## 🔧 Configure Environment Variables

Update your `.env` file with the Google OAuth credentials:

```env
# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_actual_google_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
```

**Example**:
```env
VITE_GOOGLE_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_secret_here
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
```

## 📱 Testing Google OAuth

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

### Step 3: Test Authentication

1. **Open your app**: http://localhost:5173
2. **Navigate to Authentication**
3. **Try Google Sign-In**:
   - Click "Continue with Google" button
   - Should redirect to Google OAuth popup
   - After successful authentication, you'll be signed in

### Expected Flow:

1. **User clicks Google button** → OAuth popup opens
2. **User signs in with Google** → Google returns authorization code
3. **App exchanges code for tokens** → Gets user profile information
4. **User created/updated in database** → JWT tokens generated
5. **User signed in to app** → Redirected to dashboard

## 🗄️ Database Integration

Your PostgreSQL database now supports:

### OAuth Users Table Structure:
```sql
-- Additional columns added to users table
auth_provider VARCHAR(20) DEFAULT 'local'  -- 'google', 'local'
google_id VARCHAR(255) UNIQUE              -- Google user ID
oauth_access_token TEXT                    -- Google access token
oauth_refresh_token TEXT                   -- Google refresh token  
oauth_token_expires_at TIMESTAMP           -- Token expiration
```

### OAuth Sessions Table:
```sql
-- Dedicated table for OAuth session management
CREATE TABLE oauth_sessions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    provider VARCHAR(20),                  -- 'google'
    provider_user_id VARCHAR(255),         -- Google user ID
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP,
    scope TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## 🔐 Security Features

### JWT Token Management:
- **Access Token**: 7 days expiration (configurable)
- **Refresh Token**: 30 days expiration (configurable)
- **Secure Storage**: Tokens stored securely in database
- **Auto-refresh**: Automatic token refresh when needed

### User Data Protection:
- **Email Verification**: Automatic verification via Google
- **Profile Pictures**: Securely stored Google profile URLs
- **Privacy Settings**: Default privacy-focused settings
- **Data Encryption**: Sensitive data encrypted in database

## 🚀 Production Deployment

### Update Environment Variables:
```env
# Production Google OAuth
VITE_GOOGLE_CLIENT_ID=your_production_client_id
GOOGLE_CLIENT_SECRET=your_production_client_secret
VITE_GOOGLE_REDIRECT_URI=https://your-domain.com/auth/google/callback

# Production Database
DATABASE_URL=postgresql://user:pass@your-db-host:5432/neeva_production

# Secure JWT Secret
JWT_SECRET=your_super_secure_jwt_secret_here
```

### Google Cloud Console Production Setup:
1. **Add production domain** to authorized origins
2. **Add production callback URL** to redirect URIs
3. **Verify domain ownership** if required
4. **Submit app for verification** if needed

## 🧪 Testing Checklist

### Manual Testing:
- [ ] Google sign-in popup opens correctly
- [ ] User can authenticate with Google account
- [ ] New users are created in database
- [ ] Existing users are updated with Google info
- [ ] JWT tokens are generated correctly
- [ ] User is redirected to dashboard after auth
- [ ] User profile shows Google information
- [ ] Sign-out works correctly

### Database Verification:
```sql
-- Check OAuth users
SELECT email, auth_provider, google_id, email_verified 
FROM users 
WHERE auth_provider = 'google';

-- Check OAuth sessions
SELECT u.email, os.provider, os.created_at 
FROM users u 
JOIN oauth_sessions os ON u.id = os.user_id;
```

## 🛠️ Troubleshooting

### Common Issues:

1. **"OAuth client not found"**:
   - Verify Client ID in `.env` file
   - Check Google Cloud Console credentials

2. **"Redirect URI mismatch"**:
   - Ensure redirect URI matches exactly in Google Console
   - Check for trailing slashes or port differences

3. **"Access blocked"**:
   - Complete OAuth consent screen configuration
   - Add your email to test users if app not verified

4. **Database connection errors**:
   - Verify PostgreSQL is running
   - Check database credentials in `.env`

### Debug Mode:
Enable debug logging by adding to `.env`:
```env
DEBUG=oauth:*
VITE_DEBUG_OAUTH=true
```

## 📞 Support

### Resources:
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Neeva App Documentation](./README.md)

### Getting Help:
1. Check browser console for JavaScript errors
2. Check network tab for API call failures
3. Verify database logs for connection issues
4. Review Google Cloud Console audit logs

---

## ✅ Setup Complete!

Your Neeva Mental Health App now supports:
- 🔐 **Google OAuth Sign-In/Sign-Up**
- 👤 **Automatic User Profile Creation**
- 🗄️ **Secure Database Integration**
- 🔄 **Token Management & Refresh**
- 📱 **Mobile-Ready Authentication**

**Next Steps**: Update your `.env` file with actual Google OAuth credentials and start testing! 🚀
