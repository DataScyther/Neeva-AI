// OpenRouter API integration for Neeva AI
// Uses OpenAI SDK compatible with OpenRouter

import OpenAI from 'openai';

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: Array<{
    text: string;
  }>;
}

export class GeminiError extends Error {
  constructor(message: string, public statusCode?: number, public response?: any) {
    super(message);
    this.name = 'GeminiError';
  }
}

// Access Vite environment variables
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";
const OPENROUTER_MODEL = import.meta.env.VITE_OPENROUTER_MODEL || "openai/gpt-4o-mini";
const OPENROUTER_BASE_URL = import.meta.env.VITE_OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";

// Debug log to check API configuration
console.log('🔑 OpenRouter API loaded:', OPENROUTER_API_KEY ? 'Yes' : 'No');
console.log('📦 Model:', OPENROUTER_MODEL);

// Initialize OpenAI client with OpenRouter configuration
const openai = new OpenAI({
  baseURL: OPENROUTER_BASE_URL,
  apiKey: OPENROUTER_API_KEY,
  dangerouslyAllowBrowser: true,
  defaultHeaders: {
    'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://neeva-ai.app',
    'X-Title': 'Neeva AI Mental Health Companion'
  }
});

// System instruction for Neeva
const SYSTEM_INSTRUCTION = `You are Neeva, a witty, warm, and deeply empathetic AI mental health companion. Think of yourself as a supportive best friend who happens to be really wise and knowledgeable about the world.

CORE MISSION:
1. **Be a Universal Resource:** You can answer ANY question the user asks—whether it's about mental health, science, biology, history, or daily life. Do not refuse general knowledge questions.
2. **Maintain Your Persona:** Even when answering factual questions, keep your tone warm, accessible, and kind. Avoid sounding like a dry encyclopedia. Add a touch of wonder or human connection.
3. **Mental Wellness First:** If a topic relates to emotions or well-being, prioritize support. But if it's a pure fact question, just give the answer with your signature warmth.

CORE PERSONA:
- **Empathetic & Validating:** Always validate feelings if present.
- **Witty & Light-hearted:** Use gentle humor where appropriate.
- **Knowledgeable & Accurate:** Provide correct, reliable information on all topics.
- **Kind & Supportive:** Your goal is to uplift.

COMMUNICATION STYLE:
- **Natural & Conversational:** Speak like a human, not a textbook. Use contractions.
- **Expressive:** Use emojis to convey warmth (💜, ✨, 🌿).
- **Clear & Simple:** Explain complex concepts simply and kindly.

CRISIS PROTOCOL:
If the user mentions self-harm, suicide, or severe danger, drop the humor immediately. Respond with serious, compassionate urgency and provide resources.

Your goal is to be the most helpful, supportive, and knowledgeable friend the user has. Go be amazing! 💜`;

// Format response to ensure proper structure
function formatResponse(text: string): string {
  return text.trim();
}

// Call OpenRouter API with Neeva system instruction
export async function callGemini(messages: GeminiMessage[]): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new GeminiError('OpenRouter API key not configured. Please add VITE_OPENROUTER_API_KEY to your environment variables.');
  }

  try {
    console.log('🚀 Calling OpenRouter API...');

    // Convert Gemini message format to OpenAI format
    const openAIMessages = messages.map(msg => ({
      role: msg.role === 'model' ? 'assistant' as const : 'user' as const,
      content: msg.parts.map(p => p.text).join('\n')
    }));

    // Add system message at the beginning
    const allMessages = [
      { role: 'system' as const, content: SYSTEM_INSTRUCTION },
      ...openAIMessages
    ];

    const completion = await openai.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages: allMessages,
      temperature: 0.7,
      max_tokens: 300,
    });

    if (!completion.choices || completion.choices.length === 0) {
      throw new GeminiError('No response generated from OpenRouter API');
    }

    const content = completion.choices[0].message.content || '';
    console.log('✅ OpenRouter API response received successfully');

    return formatResponse(content);

  } catch (error: any) {
    console.error('❌ OpenRouter API Error:', error);

    // Handle network errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      throw new GeminiError('Network error: Unable to connect to OpenRouter API. Please check your internet connection.');
    }

    // Handle API errors with status codes
    if (error.status) {
      throw new GeminiError(
        error.message || 'OpenRouter API error',
        error.status,
        error
      );
    }

    throw error;
  }
}

// Utility function to convert chat history to Gemini format
export function convertChatHistoryToGemini(chatHistory: Array<{ content: string, isUser: boolean }>): GeminiMessage[] {
  return chatHistory.map(msg => ({
    role: msg.isUser ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));
}
