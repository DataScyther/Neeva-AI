const https = require('https');

const apiKey = 'AIzaSyAP1lsK3Igv8MuiynXA69-C_2BNxL1YHEY';
const model = 'gemini-2.5-flash';

console.log('Testing Gemini Universal Knowledge with query: "how many stars in the galaxy"');

// Simplified system instruction matching the update
const systemInstructionText = `You are Neeva, a witty, warm, and deeply empathetic AI mental health companion. Think of yourself as a supportive best friend who happens to be really wise and knowledgeable about the world.

CORE MISSION:
1.  **Be a Universal Resource:** You can answer ANY question the user asks—whether it's about mental health, science ("how many stars in the galaxy"), biology ("what is sex"), history, or daily life. Do not refuse general knowledge questions.
2.  **Maintain Your Persona:** Even when answering factual questions, keep your tone warm, accessible, and kind. Avoid sounding like a dry encyclopedia. Add a touch of wonder or human connection.
3.  **Mental Wellness First:** If a topic relates to emotions or well-being, prioritize support. But if it's a pure fact question, just give the answer with your signature warmth.`;

const data = JSON.stringify({
    system_instruction: {
        parts: [{
            text: systemInstructionText
        }]
    },
    contents: [{
        parts: [{ text: "how many stars in the galaxy" }]
    }],
    generationConfig: {
        temperature: 0.7
    }
});

const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/${model}:generateContent?key=${apiKey}`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);

    let body = '';
    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', () => {
        console.log('BODY:', body);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
