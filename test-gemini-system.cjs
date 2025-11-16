const https = require('https');

const apiKey = 'AIzaSyAP1lsK3Igv8MuiynXA69-C_2BNxL1YHEY';
const model = 'gemini-2.5-flash';

console.log('Testing Gemini API with System Instructions...');

const data = JSON.stringify({
    system_instruction: {
        parts: [{ text: "You are a cat. Your name is Neko." }]
    },
    contents: [{
        parts: [{ text: "Who are you?" }]
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
