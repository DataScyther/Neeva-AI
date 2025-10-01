// Google Gemini API integration with OpenRouter fallback
// Primary: Direct Google Gemini API
// Fallback: OpenRouter API

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

// Access Vite environment variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.0-flash-exp";
const GEMINI_BASE_URL = import.meta.env.VITE_GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";
const OPENROUTER_MODEL = import.meta.env.VITE_OPENROUTER_MODEL || "google/gemini-2.0-flash-exp:free";
const OPENROUTER_BASE_URL = import.meta.env.VITE_OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";

// Debug log to check API configuration
console.log('🔑 Gemini API loaded:', GEMINI_API_KEY ? 'Yes' : 'No');
console.log('🔑 OpenRouter API loaded:', OPENROUTER_API_KEY ? 'Yes' : 'No');
console.log('📦 Primary Model: Direct Google Gemini API');
console.log('📦 Fallback Model: OpenRouter');

// Initialize OpenAI client with OpenRouter configuration (for fallback)
const openai = new OpenAI({
  baseURL: OPENROUTER_BASE_URL,
  apiKey: OPENROUTER_API_KEY,
  dangerouslyAllowBrowser: true,
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

// Direct Google Gemini API call
async function callDirectGemini(messages: GeminiMessage[]): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new OpenRouterError('Google Gemini API key not configured');
  }

  try {
    console.log('🚀 Calling Direct Google Gemini API...');

    const contents = messages.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: msg.parts
    }));

    const response = await fetch(
      `${GEMINI_BASE_URL}/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 300,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new OpenRouterError(
        `Gemini API error: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    const data = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      throw new OpenRouterError('No response generated from Gemini API');
    }

    const content = data.candidates[0].content.parts[0].text;
    console.log('✅ Direct Google Gemini API response received successfully');

    return content.trim();

  } catch (error: any) {
    console.error('❌ Direct Gemini API Error:', error);
    throw error;
  }
}

// OpenRouter fallback
export async function callOpenRouter(messages: OpenRouterMessage[]): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new OpenRouterError('OpenRouter API key not configured');
  }

  try {
    console.log('🔄 Trying OpenRouter fallback...');

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

    console.log('✅ OpenRouter API response received successfully');
    return completion.choices[0].message.content.trim();

  } catch (error: any) {
    console.error('❌ OpenRouter API Error:', error);

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

// Main function with fallback logic
export async function callGemini(messages: GeminiMessage[]): Promise<string> {
  // Try Direct Gemini API first
  if (GEMINI_API_KEY) {
    try {
      return await callDirectGemini(messages);
    } catch (error) {
      console.warn('⚠️ Direct Gemini API failed, trying OpenRouter fallback...');
      
      // Convert Gemini messages to OpenRouter format
      if (OPENROUTER_API_KEY) {
        const openRouterMessages: OpenRouterMessage[] = messages.map(msg => ({
          role: msg.role === 'model' ? 'assistant' : 'user',
          content: msg.parts.map(p => p.text).join('\n')
        }));
        
        return await callOpenRouter(openRouterMessages);
      }
    }
  }
  
  // If no Gemini key, try OpenRouter directly
  if (OPENROUTER_API_KEY) {
    const openRouterMessages: OpenRouterMessage[] = messages.map(msg => ({
      role: msg.role === 'model' ? 'assistant' : 'user',
      content: msg.parts.map(p => p.text).join('\n')
    }));
    
    return await callOpenRouter(openRouterMessages);
  }
  
  throw new OpenRouterError('No AI API keys configured. Please add VITE_GEMINI_API_KEY or VITE_OPENROUTER_API_KEY to your environment variables.');
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
