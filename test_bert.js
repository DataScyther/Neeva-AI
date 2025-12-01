// test_bert.js
// Simple Node script to test OpenRouter Bert-Nebulon Alpha model
// Uses built-in fetch (Node 18+)

const API_KEY = process.env.VITE_OPENROUTER_API_KEY;
const MODEL = process.env.VITE_OPENROUTER_MODEL || 'openrouter/bert-nebulon-alpha';
const BASE_URL = process.env.VITE_OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

async function test() {
    if (!API_KEY) {
        console.error('❌ No API key set in environment');
        return;
    }
    console.log('🔧 Using model:', MODEL);
    const messages = [{ role: 'user', content: 'Hello, how are you?' }];
    try {
        const response = await fetch(`${BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: MODEL,
                messages,
                max_tokens: 100,
                temperature: 0.7,
            }),
        });
        const data = await response.json();
        console.log('✅ Response received:');
        console.dir(data, { depth: null });
    } catch (err) {
        console.error('❌ Error during API call:', err);
    }
}

test();
