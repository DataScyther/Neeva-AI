# Fixing Google Authentication Redirect URLs Permanently

This guide explains how to permanently fix the Google authentication redirect issue where users are redirected to `localhost:3000` instead of the deployed application.

## Problem Summary

When users sign in or sign up with Google, they are being redirected to `localhost:3000` instead of the deployed application (Netlify, Vercel, etc.). This happens because the Supabase OAuth configuration still has localhost URLs configured for redirect.

## Solution Overview

The solution involves two parts:
1. **Client-side code** - Already implemented in `src/lib/supabase/auth.ts`
2. **Server-side configuration** - Needs to be updated in the Supabase Dashboard

## Client-Side Implementation (Already Done)

The client-side code has been updated to dynamically determine the correct redirect URL based on the environment:

```typescript
// Function to get the correct redirect URL based on environment
export const getRedirectUrl = (): string => {
  // For development environments
  if (window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '0.0.0.0') {
    return `${window.location.origin}/`;
  }
  
  // For production environments (including Netlify, Vercel, etc.)
  return `${window.location.origin}/`;
};
```

This function is used in all authentication methods to ensure the correct redirect URL is used.

## Server-Side Configuration (Needs to be Done)

### Step 1: Access Supabase Dashboard

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (`lzuwgoefuskxjaggmcev`)

### Step 2: Navigate to Authentication Settings

1. In the left sidebar, click on **Authentication**
2. Click on **URL Configuration** in the sub-menu

### Step 3: Update Redirect URLs

In the **Redirect URLs** section, you need to add all the URLs where your application can be accessed:

1. **For Local Development:**
   - `http://localhost:3000/`

2. **For Netlify Deployment:**
   - `https://your-netlify-domain.netlify.app/`
   - Replace `your-netlify-domain` with your actual Netlify subdomain

3. **For Vercel Deployment:**
   - `https://your-vercel-domain.vercel.app/`
   - Replace `your-vercel-domain` with your actual Vercel subdomain

### Step 4: Save Changes

Click the **Save** button to apply the changes.

## How It Works

1. When a user initiates Google Sign-In, the client-side code determines the current environment
2. It generates the appropriate redirect URL based on whether it's running locally or in production
3. This URL is passed to Supabase OAuth
4. After successful authentication, Google redirects back to this URL
5. Supabase validates that this URL is in the allowed redirect URLs list
6. If valid, the user is redirected back to your application

## Important Notes

1. **Security**: Supabase only allows redirects to URLs that are explicitly listed in the dashboard for security reasons
2. **Multiple Environments**: You need to add redirect URLs for all environments where your application will be deployed
3. **Trailing Slashes**: Make sure to include trailing slashes in your URLs as shown in the examples
4. **HTTPS**: Production URLs should use HTTPS

## Testing the Fix

After updating the Supabase configuration:

1. Deploy your application to Netlify or Vercel
2. Try signing in with Google
3. You should now be redirected to the correct deployed URL instead of localhost

## Troubleshooting

If you still experience issues:

1. **Check the Console**: Look for any error messages in the browser console
2. **Verify URLs**: Double-check that all redirect URLs in Supabase exactly match your deployed URLs
3. **Clear Cache**: Clear your browser cache and try again
4. **Check Network Tab**: Look at the network requests to see if there are any failed redirects

## Additional Resources

- [Supabase Authentication Documentation](https://supabase.com/docs/guides/auth)
- [Supabase OAuth Configuration](https://supabase.com/docs/guides/auth/social-login)