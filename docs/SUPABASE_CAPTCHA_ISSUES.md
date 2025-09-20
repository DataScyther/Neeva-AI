# Supabase CAPTCHA Issues and Solutions

This guide explains how to handle CAPTCHA verification failures in Supabase authentication and provides solutions for common issues.

## Common CAPTCHA Errors

1. **"captcha verification process failed"** - The most common error
2. **"Unexpected failure"** - Generic error that may include CAPTCHA issues

## Solutions

### 1. Check Supabase Dashboard Settings

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **Policies**
4. Check if CAPTCHA is enabled and properly configured

### 2. Verify Your Domain Settings

1. In the Supabase Dashboard, go to **Authentication** → **URL Configuration**
2. Ensure your domain is listed in the **Redirect URLs** section
3. For local development, add `http://localhost:3000/`
4. For production, add your deployed URLs (Netlify, Vercel, etc.)

### 3. Temporary Workaround for Development

The client-side code has been updated to skip security checks during local development:

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
  // Skip CAPTCHA for testing (only in development)
  options: {
    skipSecurityChecks: window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.location.hostname === '0.0.0.0'
  }
})
```

### 4. Clear Browser Cache and Cookies

Sometimes CAPTCHA issues are caused by cached data:

1. Clear your browser cache and cookies
2. Try signing in again in an incognito/private window
3. Disable browser extensions that might interfere with authentication

### 5. Check Network Connectivity

1. Ensure you have a stable internet connection
2. Check if there are any firewall or proxy settings blocking requests to Supabase

## For Production Deployment

When deploying to production:

1. Make sure your domain is properly configured in Supabase
2. Ensure you're using HTTPS (required for many CAPTCHA services)
3. Test authentication thoroughly after deployment

## Troubleshooting Steps

1. **Check Browser Console**: Look for detailed error messages
2. **Verify Credentials**: Ensure your Supabase URL and anon key are correct
3. **Test with Different Browsers**: Rule out browser-specific issues
4. **Check Supabase Status**: Visit [Supabase Status Page](https://status.supabase.com/) to see if there are any ongoing issues

## Contact Support

If the issue persists:

1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Visit the [Supabase GitHub Issues](https://github.com/supabase/supabase/issues)
3. Contact Supabase support through your dashboard

## Additional Notes

- CAPTCHA failures can sometimes be temporary and resolve themselves
- Make sure your users understand that these issues are usually temporary
- Consider implementing a retry mechanism in your authentication flow