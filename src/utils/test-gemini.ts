// Test script to verify Google Gemini API key
import { callGemini, GeminiError } from './gemini';

async function testGeminiApiKey() {
  const API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY;
  const MODEL = (import.meta as any).env.VITE_GEMINI_MODEL || 'gemini-2.0-flash';
  const BASE_URL = (import.meta as any).env.VITE_GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta';

  console.log('Testing Google Gemini API Key...');
  console.log('API Key exists:', !!API_KEY);
  console.log('Model:', MODEL);
  console.log('Base URL:', BASE_URL);

  if (!API_KEY) {
    console.error('❌ ERROR: VITE_GEMINI_API_KEY is not set!');
    return;
  }

  try {
    const response = await callGemini([
      {
        role: 'user',
        parts: [{ text: 'Hello, this is a test message.' }]
      }
    ]);

    console.log('✅ API Key is valid and working!');
    console.log('Response:', response);
  } catch (error) {
    if (error instanceof GeminiError) {
      console.error('❌ Gemini API test failed:', error.message);
      console.error('Status code:', error.statusCode);
    } else {
      console.error('❌ Network error during API test:', error);
    }
  }
}

// Run the test
testGeminiApiKey();

export {};