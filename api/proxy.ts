import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
    runtime: 'edge',
};

export default async function handler(
    request: Request,
) {
    // Handle CORS
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!API_KEY) {
        return new Response(JSON.stringify({ error: 'Server configuration error: GEMINI_API_KEY is missing.' }), { status: 500 });
    }

    try {
        const payload = await request.json();

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });

    } catch (error) {
        return new Response(JSON.stringify({
            error: 'Internal Server Error',
            details: error instanceof Error ? error.message : String(error)
        }), { status: 500 });
    }
}
