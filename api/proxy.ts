export const config = {
    runtime: 'edge',
};

export default async function handler(request: Request) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-ai-provider, x-gemini-key',
            },
        });
    }

    const url = new URL(request.url);
    const pathname = url.pathname;

    // 1. Proxying to NVIDIA API
    if (pathname.startsWith('/api/nvidia/')) {
        const targetPath = pathname.replace(/^\/api\/nvidia/, '');
        const targetUrl = `https://integrate.api.nvidia.com${targetPath}`;
        const apiKey = process.env.NVIDIA_API_KEY || process.env.VITE_NVIDIA_API_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'NVIDIA_API_KEY is not configured on the server.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        try {
            const bodyText = await request.text();
            const headers = new Headers();
            headers.set('Content-Type', 'application/json');
            headers.set('Authorization', `Bearer ${apiKey}`);

            const response = await fetch(targetUrl, {
                method: request.method,
                headers: headers,
                body: request.method === 'POST' ? bodyText : undefined,
            });

            const responseData = await response.text();
            return new Response(responseData, {
                status: response.status,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });
        } catch (error) {
            return new Response(JSON.stringify({
                error: 'Internal Server Error (NVIDIA Proxy)',
                details: error instanceof Error ? error.message : String(error)
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    }

    // 2. Proxying to Gemini API (for voice transcription or fallback)
    if (pathname === '/api/chat') {
        const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is not configured on the server.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        try {
            const payload = await request.json();
            const model = payload.model || 'gemini-2.5-flash';
            const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

            const response = await fetch(targetUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ contents: payload.contents })
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
                error: 'Internal Server Error (Gemini Proxy)',
                details: error instanceof Error ? error.message : String(error)
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    }

    return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
    });
}
