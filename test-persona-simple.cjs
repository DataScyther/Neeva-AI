const https = require('https');

const apiKey = 'AIzaSyAP1lsK3Igv8MuiynXA69-C_2BNxL1YHEY';
const model = 'gemini-2.5-flash';

console.log('Testing Gemini Persona with query: "I can\'t sleep well"');

// Simplified system instruction for testing purposes to avoid JSON escaping hell in raw node script
const systemInstructionText = "You are Neeva, a witty and empathetic mental health companion. Validate feelings first, use gentle humor, and offer specific advice. If I say I can't sleep, be empathetic and ask what's on my mind.";

const data = JSON.stringify({
    system_instruction: {
        parts: [{
            text: systemInstructionText
        }]
    },
    contents: [{
        parts: [{ text: "I can't sleep well" }]
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
