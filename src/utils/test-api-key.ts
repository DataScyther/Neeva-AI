// Test script to verify the new OpenRouter API key
async function testApiKey() {
  const API_KEY = (import.meta as any).env.VITE_OPENROUTER_API_KEY;
  const MODEL = (import.meta as any).env.VITE_OPENROUTER_MODEL || 'openai/gpt-oss-120b:free';
  const BASE_URL = (import.meta as any).env.VITE_OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

  console.log('Testing OpenRouter API Key...');
  console.log('API Key exists:', !!API_KEY);
  console.log('Model:', MODEL);
  console.log('Base URL:', BASE_URL);

  if (!API_KEY) {
    console.error('❌ ERROR: VITE_OPENROUTER_API_KEY is not set!');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Neeva AI Key Test'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'user', content: 'Hello, this is a test message.' }
        ],
        max_tokens: 50
      })
    });

    console.log('API Response Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Key is valid and working!');
      console.log('Response:', data.choices[0].message.content);
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ API Key test failed with status:', response.status);
      console.error('Error details:', errorData);
    }
  } catch (error) {
    console.error('❌ Network error during API test:', error);
  }
}

// Run the test
testApiKey();

export {};