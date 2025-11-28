# Vercel Environment Variables Setup

When deploying to Vercel, you need to add the following environment variables in your Vercel dashboard:

## Required Environment Variables

Navigate to: **Project Settings → Environment Variables**

Add these variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `OPENROUTER_API_KEY` | `sk-or-v1-...` (Your Actual API Key) | Production, Preview, Development |
| `OPENROUTER_MODEL` | `x-ai/grok-4.1-fast:free` | Production, Preview, Development |

## After Adding Variables

1. Click "Save"
2. **Redeploy** your application for changes to take effect
3. Test the chat functionality to ensure it works

## Local Development

For local development with Vercel functions, the API key is stored in `.env.local` (gitignored).

Run locally with:
```bash
vercel dev
```

This will start:
- Vite dev server on port 5173
- Vercel functions on port 3000
- Automatic proxy from Vite → Vercel functions

## Security Notes

✅ API key is **never** exposed in frontend code  
✅ API key is **never** in the built `dist/` folder  
✅ API key is only stored in backend environment variables  
❌ Never commit `.env.local` to git  
