# 🚀 Running Neeva AI Locally

## Important: Use Vercel Dev Server

Since the API calls now use a secure backend proxy, you **must** run the Vercel development server to test locally.

### ❌ Don't use:
```bash
npm run dev  # This won't work with the backend!
```

### ✅ Use instead:
```bash
vercel dev
```

This will:
- Start the Vite frontend on port 5173
- Start Vercel serverless functions on port 3000  
- Automatically proxy `/api/*` requests from frontend to backend
- Load API keys from `.env.local` (backend secrets)

## First Time Setup

1. Make sure Vercel CLI is installed:
   ```bash
   npm i -g vercel
   ```

2. Make sure `.env.local` exists with your API key:
   ```bash
   # .env.local (already created)
   OPENROUTER_API_KEY=sk-or-v1-... (Your Actual API Key)
   OPENROUTER_MODEL=x-ai/grok-4.1-fast:free
   ```

3. Run the dev server:
   ```bash
   vercel dev
   ```

4. Visit `http://localhost:3000` (Vercel will redirect appropriately)

## Why This Change?

**Security!** 🔒
- Your API key is never exposed in the frontend code
- The key is not in the built `dist/` folder
- The key is only stored in backend environment variables
- Much safer than the previous `VITE_*` approach

## Deployment

When deploying to Vercel:
1. Set environment variables in Vercel dashboard (see `VERCEL_SETUP.md`)
2. The production build automatically uses the backend proxy
3. No API key ever reaches the frontend!
