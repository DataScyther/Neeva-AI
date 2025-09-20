# Updating Supabase Redirect URLs

This guide explains how to update your Supabase project to remove localhost URLs and use only the Netlify deployment URL.

## Steps to Update Redirect URLs

### 1. Access Supabase Dashboard

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Log in to your account
3. Select your project (`lzuwgoefuskxjaggmcev`)

### 2. Navigate to Authentication Settings

1. In the left sidebar, click on **Authentication**
2. Click on **URL Configuration** in the sub-menu

### 3. Update Redirect URLs

In the **Redirect URLs** section:

1. **Remove** the following localhost URLs if they exist:
   - `http://localhost:3000/`
   - `http://localhost:3000`
   - `http://127.0.0.1:3000/`
   - `http://127.0.0.1:3000`

2. **Ensure** the following URL is present:
   - `https://neevaai.netlify.app/`

3. **Add** any other production URLs you may have (if applicable)

### 4. Save Changes

Click the **Save** button to apply the changes.

## Why This Change Was Made

1. **Consistency**: Using only the production URL ensures consistent behavior across all environments
2. **Security**: Removes potential security risks associated with localhost redirects in production
3. **Simplicity**: Simplifies the authentication flow by using a single, consistent redirect URL

## Testing the Changes

After updating the redirect URLs:

1. Deploy your application to Netlify (if not already deployed)
2. Try signing in with email and password
3. Try signing in with Google
4. Verify that you're properly redirected after authentication

## Troubleshooting

If you encounter issues after making these changes:

1. **Check the Console**: Look for any error messages in the browser console
2. **Verify URLs**: Double-check that `https://neevaai.netlify.app/` exactly matches your deployed URL
3. **Clear Cache**: Clear your browser cache and try again
4. **Wait for Propagation**: Sometimes changes take a few minutes to propagate

## Additional Notes

- This change affects all authentication methods (email/password and OAuth)
- Users currently signed in may need to sign in again
- Make sure your Netlify site is properly deployed and accessible at `https://neevaai.netlify.app/`