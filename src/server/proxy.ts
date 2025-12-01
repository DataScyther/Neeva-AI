// Proxy server to securely forward OpenRouter API requests
// This server runs on Node.js and uses Express to expose a local endpoint
// that the client can call without exposing the API key.

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Environment variables (these should be set in the hosting platform)
// We check for both standard and VITE_ prefixed variables to support local .env files
// Proxy endpoint – the client sends the messages array
app.post('/api/openrouter', async (req, res) => {
    // Access environment variables at runtime to ensure they are available in serverless context
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY;
    const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || process.env.VITE_OPENROUTER_MODEL || 'openrouter/bert-nebulon-alpha';
    const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || process.env.VITE_OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

    if (!OPENROUTER_API_KEY) {
        console.error('❌ OPENROUTER_API_KEY is not set.');
        return res.status(500).json({ error: 'Server configuration error: API key not set.' });
    }

    try {
        const messages = req.body.messages;
        if (!Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid request: "messages" array is required.' });
        }

        const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': req.headers.origin || '',
                'X-Title': 'Neeva Mental Health App'
            },
            body: JSON.stringify({
                model: OPENROUTER_MODEL,
                messages,
                max_tokens: 300,
                temperature: 0.7,
                top_p: 0.9,
                stream: false
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return res.status(response.status).json({
                error: 'OpenRouter API error',
                status: response.status,
                details: errorData
            });
        }

        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error('Proxy error:', err);
        res.status(500).json({ error: 'Internal server error', details: err instanceof Error ? err.message : err });
    }
});

// Simple health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Export the app for Vercel (serverless)
export default app;

// Start the server if running directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
        process.exit(1);
    }
    app.listen(PORT, () => {
        console.log(`🚀 Proxy server listening on http://localhost:${PORT}`);
    });
}
