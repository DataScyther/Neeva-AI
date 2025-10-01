// OpenRouter API integration using OpenAI SDK
// Updated to use Google Gemini 2.0 Flash via OpenRouter

import OpenAI from 'openai';

export interface OpenRouterMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
    index: number;
  }>;
  created: number;
  id: string;
  model: string;
  object: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Access Vite environment variables for OpenRouter
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";
const OPENROUTER_MODEL = import.meta.env.VITE_OPENROUTER_MODEL || "google/gemini-2.0-flash-exp:free";
const OPENROUTER_BASE_URL = import.meta.env.VITE_OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";

// Debug log to check API configuration
console.log('OpenRouter Google Gemini API loaded:', OPENROUTER_API_KEY ? 'Yes' : 'No');
console.log('Model: google/gemini-2.0-flash-exp:free');
console.log('Base URL: https://openrouter.ai/api/v1');

// Initialize OpenAI client with OpenRouter configuration
const openai = new OpenAI({
  baseURL: OPENROUTER_BASE_URL,
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': window.location.origin,
    'X-Title': 'Neeva AI Mental Health Companion'
  }
});

export class OpenRouterError extends Error {
  constructor(message: string, public statusCode?: number, public response?: any) {
    super(message);
    this.name = 'OpenRouterError';
  }
}

export async function callOpenRouter(messages: OpenRouterMessage[]): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new OpenRouterError('AI chat is temporarily unavailable. Please check your OpenRouter API configuration.');
  }

  try {
    console.log('Trying OpenRouter Google Gemini API...');

    const completion = await openai.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages: messages,
      max_tokens: 300,
      temperature: 0.7,
      top_p: 0.9
    });

    if (!completion.choices || completion.choices.length === 0 || !completion.choices[0].message.content) {
      throw new OpenRouterError('No response generated from OpenRouter API');
    }

    console.log('✅ OpenRouter Google Gemini API response received successfully');
    console.log(`Tokens used: ${completion.usage?.total_tokens || 'unknown'}`);

    return completion.choices[0].message.content.trim();

  } catch (error: any) {
    console.error('OpenRouter API Error:', error);

    if (error.status === 401) {
      throw new OpenRouterError('OpenRouter API authentication failed. Please verify your API key is valid.', 401, error);
    } else if (error.status === 429) {
      throw new OpenRouterError('OpenRouter API rate limit exceeded. Please wait before making more requests.', 429, error);
    } else if (error.status === 400) {
      throw new OpenRouterError('OpenRouter API request failed. Please check your configuration.', 400, error);
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new OpenRouterError('Network error: Unable to connect to OpenRouter API. Please check your internet connection.');
    }

    throw new OpenRouterError(`Unexpected error: ${error.message}`);
  }
}

// Backward compatibility function (for any existing code that calls callGemini)
export async function callGemini(messages: any[]): Promise<string> {
  return callOpenRouter(messages);
}

// Legacy types for backward compatibility
export interface GeminiMessage {
  role: 'user' | 'model';
  parts: Array<{
    text: string;
  }>;
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
      role: string;
    };
    finishReason: string;
    index: number;
    safetyRatings: Array<{
      category: string;
      probability: string;
    }>;
  }>;
  promptFeedback?: {
    safetyRatings: Array<{
      category: string;
      probability: string;
    }>;
  };
}

export class GeminiError extends OpenRouterError {
  constructor(message: string, statusCode?: number, response?: any) {
    super(message, statusCode, response);
    this.name = 'GeminiError';
  }
}

// Utility function to convert chat history to Gemini format (for backward compatibility)
export function convertChatHistoryToGemini(chatHistory: Array<{content: string, isUser: boolean}>): GeminiMessage[] {
  return chatHistory.map(msg => ({
    role: msg.isUser ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));
}
