// Proxy server to securely forward Gemini API requests
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

app.post('/api/chat', async (req, res) => {
    // 1. Get API Key
    const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!API_KEY) {
        console.error('❌ GEMINI_API_KEY is not set.');
        return res.status(500).json({ error: 'Server configuration error: API key not set.' });
    }

    try {
        // 2. Get Request Body (expecting { messages: [...] } from frontend)
        // We need to convert this to Gemini format if it's not already,
        // but let's assume the frontend sends the correct structure or we convert it here.
        // The user's curl example shows: { contents: [{ parts: [{ text: "..." }] }] }

        // Let's accept the raw body if it matches Gemini format, or convert standard messages
        let payload = req.body;

        // If the frontend sends "messages" (OpenAI style), we might need to convert,
        // but the plan is to update frontend to send Gemini format.
        // Let's assume frontend sends { contents: [...] }

        console.log('🚀 Proxying request to Gemini API...');

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(`❌ Gemini API Error (${response.status}):`, JSON.stringify(errorData));
            return res.status(response.status).json({
                error: 'Gemini API error',
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

export default app;

// Start the server if running directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!API_KEY) {
        console.warn('⚠️ Warning: GEMINI_API_KEY is not set.');
    }
    app.listen(PORT, () => {
        console.log(`🚀 Proxy server listening on http://localhost:${PORT}`);
    });
}
