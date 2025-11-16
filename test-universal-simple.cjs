const https = require('https');

const apiKey = 'AIzaSyAP1lsK3Igv8MuiynXA69-C_2BNxL1YHEY';
const model = 'gemini-2.5-flash';

console.log('Testing Gemini Universal Knowledge with query: "how many stars in the galaxy"');

// Simplified system instruction for testing purposes
const systemInstructionText = "You are Neeva, a knowledgeable and warm AI friend. Answer ANY question (science, history, etc) with accuracy and warmth. If I ask about stars, tell me the number with a sense of wonder.";

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
