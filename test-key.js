const https = require('https');

const apiKey = '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';

const data = JSON.stringify({
  model: 'deepseek/deepseek-chat-v3.1:free',
  messages: [
    {
      role: 'user',
      content: 'Hello'
    }
  ]
});

const options = {
  hostname: 'openrouter.ai',
  path: '/api/v1/chat/completions',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('Testing API Key:', apiKey);

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
