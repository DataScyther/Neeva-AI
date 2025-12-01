import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
    runtime: 'edge', // Optional: Use Edge runtime for faster cold starts, or remove for Node.js
};

// Note: Vercel Edge Runtime uses standard Request/Response, not VercelRequest/VercelResponse
// But for compatibility with standard Node.js environment variables and modules, we'll use standard Node runtime.
// Let's stick to standard Node.js runtime for maximum compatibility with 'process.env'

export default async function handler(
    request: VercelRequest,
    response: VercelResponse
) {
    // CORS Headers
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    response.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request
    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    // 1. Get API Key
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY;

    if (!apiKey) {
        console.error('❌ OPENROUTER_API_KEY is missing in Vercel environment.');
        return response.status(500).json({
            error: 'Server configuration error: OPENROUTER_API_KEY is missing.',
            details: 'Please add OPENROUTER_API_KEY to Vercel Project Settings > Environment Variables.'
        });
    }

    // 2. Get Request Body
    const { messages } = request.body || {};

    if (!messages || !Array.isArray(messages)) {
        return response.status(400).json({ error: 'Invalid request: "messages" array is required.' });
    }

    // 3. Configuration
    const MODEL = process.env.OPENROUTER_MODEL || process.env.VITE_OPENROUTER_MODEL || 'openrouter/bert-nebulon-alpha';
    const BASE_URL = process.env.OPENROUTER_BASE_URL || process.env.VITE_OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

    try {
        console.log('🚀 Proxying request to OpenRouter...');

        // 4. Call OpenRouter
        const openRouterResponse = await fetch(`${BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://neeva-ai.vercel.app', // Update with your actual domain if known, or use a generic one
                'X-Title': 'Neeva AI'
            },
            body: JSON.stringify({
                model: MODEL,
                messages,
                max_tokens: 1000, // Increased limit
                temperature: 0.7,
            })
        });

        // 5. Handle Upstream Error
        if (!openRouterResponse.ok) {
            const errorText = await openRouterResponse.text();
            console.error(`❌ OpenRouter API Error (${openRouterResponse.status}):`, errorText);
            return response.status(openRouterResponse.status).json({
                error: 'OpenRouter API Error',
                status: openRouterResponse.status,
                details: errorText
            });
        }

        // 6. Return Success
        const data = await openRouterResponse.json();
        return response.status(200).json(data);

    } catch (error) {
        console.error('❌ Internal Proxy Error:', error);
        return response.status(500).json({
            error: 'Internal Server Error',
            details: error instanceof Error ? error.message : String(error)
        });
    }
}
