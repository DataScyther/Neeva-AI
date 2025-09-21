// Debug script to check environment variables
console.log('=== Environment Variable Debug ===');

// Check VITE_OPENROUTER_API_KEY
const apiKey = (import.meta as any).env.VITE_OPENROUTER_API_KEY;
console.log('VITE_OPENROUTER_API_KEY:', apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 5)}` : 'NOT SET');

// Check VITE_OPENROUTER_MODEL
const model = (import.meta as any).env.VITE_OPENROUTER_MODEL;
console.log('VITE_OPENROUTER_MODEL:', model || 'NOT SET (using default)');

// Check VITE_OPENROUTER_BASE_URL
const baseUrl = (import.meta as any).env.VITE_OPENROUTER_BASE_URL;
console.log('VITE_OPENROUTER_BASE_URL:', baseUrl || 'NOT SET (using default)');

// Validate API key format
if (apiKey) {
  console.log('API Key validation:');
  console.log('  - Length:', apiKey.length);
  console.log('  - Starts with sk-or-v1-:', apiKey.startsWith('sk-or-v1-'));
  console.log('  - Ends with expected format:', apiKey.length >= 20);
} else {
  console.error('❌ CRITICAL: API Key is not set!');
}

export {};