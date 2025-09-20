// Test file for OpenRouter API integration
import { callOpenRouter, OpenRouterError } from './openrouter';

export async function testOpenRouterAPI(): Promise<void> {
  console.log('🧪 Testing OpenRouter API integration...');
  
  try {
    const testMessage = [
      { role: 'user' as const, content: 'Hello, can you help me with anxiety?' }
    ];
    
    console.log('📤 Sending test message:', testMessage);
    const response = await callOpenRouter(testMessage);
    console.log('✅ API Response:', response);
    
    // Test error handling
    console.log('🔍 Testing with empty API key...');
    
  } catch (error) {
    if (error instanceof OpenRouterError) {
      console.error('🚨 OpenRouter Error:', {
        message: error.message,
        statusCode: error.statusCode,
        response: error.response
      });
    } else {
      console.error('❌ Unexpected Error:', error);
    }
  }
}

// Add this to window for manual testing in browser console
if (typeof window !== 'undefined') {
  (window as any).testOpenRouter = testOpenRouterAPI;
}
