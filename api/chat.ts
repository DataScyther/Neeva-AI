import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
    request: VercelRequest,
    response: VercelResponse
) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    const { messages } = request.body;

    if (!messages) {
        return response.status(400).json({ error: 'Messages are required' });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        console.error('OPENROUTER_API_KEY is not set');
        return response.status(500).json({ error: 'Server configuration error' });
    }

    try {
        const fetchResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://neeva-ai.app',
                'X-Title': 'Neeva AI Mental Health Companion',
            },
            body: JSON.stringify({
                model: process.env.OPENROUTER_MODEL || 'x-ai/grok-4.1-fast:free',
                messages: messages,
                temperature: 0.7,
                max_tokens: 1000,
            }),
        });

        if (!fetchResponse.ok) {
            const errorText = await fetchResponse.text();
            console.error('OpenRouter API Error:', errorText);
            return response.status(fetchResponse.status).json({ error: `OpenRouter API error: ${fetchResponse.statusText}` });
        }

        const data = await fetchResponse.json();
        return response.status(200).json(data);
    } catch (error) {
        console.error('Error calling OpenRouter:', error);
        return response.status(500).json({ error: 'Internal server error' });
    }
}
