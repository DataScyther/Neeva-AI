// Test script to verify OpenRouter API key
const API_KEY = (import.meta as any).env.VITE_OPENROUTER_API_KEY;

console.log('OpenRouter API Key Test:');
console.log('API Key exists:', !!API_KEY);
console.log('API Key length:', API_KEY ? API_KEY.length : 0);
console.log('API Key starts with:', API_KEY ? API_KEY.substring(0, 10) + '...' : 'N/A');

if (!API_KEY) {
  console.error('❌ ERROR: VITE_OPENROUTER_API_KEY is not set!');
  console.error('Please set the environment variable in Netlify dashboard.');
} else if (!API_KEY.startsWith('sk-or-v1-')) {
  console.error('❌ ERROR: API Key format is invalid!');
  console.error('API Key should start with "sk-or-v1-"');
} else {
  console.log('✅ API Key format looks correct');
}

export {};