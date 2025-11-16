const https = require('https');

const apiKey = 'AIzaSyB5pSwWn2opgAyxIzxUKQrVV6zMbszuzjY';
const model = 'gemini-2.0-flash';

console.log('Testing Gemini API Key:', apiKey);
console.log('Model:', model);

const data = JSON.stringify({
    contents: [{
        parts: [{
            text: "Hello, are you working?"
        }]
    }]
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
