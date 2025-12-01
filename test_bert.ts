// test_bert.ts
import { callOpenRouter } from './src/utils/openrouter';

async function test() {
  const messages = [{ role: 'user' as const, parts: [{ text: 'Hello, how are you?' }] }];
  try {
    const response = await callOpenRouter(messages);
    console.log('API response:', response);
  } catch (e) {
    console.error('Error calling OpenRouter:', e);
  }
}

test();
