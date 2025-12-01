import fetch from 'node-fetch';

async function test() {
    console.log('Testing proxy server...');
    try {
        const response = await fetch('http://localhost:4000/api/openrouter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'user', content: 'Hello' }]
            })
        });

        console.log('Status:', response.status);
        if (!response.ok) {
            const text = await response.text();
            console.log('Error body:', text);
        } else {
            const data = await response.json();
            console.log('Response:', JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

test();
