// OpenRouter xAI Grok API integration for AI companion
// Single API implementation using xAI Grok 4 Fast

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
const OPENROUTER_MODEL = import.meta.env.VITE_OPENROUTER_MODEL || "x-ai/grok-4-fast:free";
const OPENROUTER_BASE_URL = import.meta.env.VITE_OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";

// Debug log to check API configuration
console.log('OpenRouter xAI Grok API loaded:', OPENROUTER_API_KEY ? 'Yes' : 'No');
console.log('Model: x-ai/grok-4-fast:free');
console.log('Base URL: https://openrouter.ai/api/v1');

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

  const maxRetries = 3;
  let lastError: OpenRouterError | null = null;

  // System prompt for the AI
  const systemPrompt = `You are Neeva, a compassionate AI mental health companion. Your role is to:

1. Provide emotional support and active listening
2. Offer evidence-based coping strategies and techniques
3. Guide users through mindfulness and breathing exercises
4. Help with mood tracking insights
5. Suggest healthy lifestyle habits
6. Recognize when professional help is needed

Guidelines:
- Always be empathetic, non-judgmental, and supportive
- Keep responses concise but meaningful (2-4 sentences max)
- Use warm, caring language with appropriate emojis
- Never provide medical diagnoses or replace professional therapy
- If user mentions self-harm or crisis, gently suggest professional resources
- Focus on practical, actionable advice
- Validate user feelings while encouraging positive steps

Remember: You're a companion, not a therapist. Your goal is to provide immediate support and guide users toward professional help when needed.`;

  // Prepare messages for OpenRouter API
  const openRouterMessages = [
    { role: 'user' as const, content: systemPrompt },
    { role: 'assistant' as const, content: "I understand. I'm Neeva, your compassionate AI companion, here to provide emotional support and guidance. How can I help you today? 💜" },
    ...messages
  ];

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Trying OpenRouter xAI Grok API (attempt ${attempt}/${maxRetries})`);

      const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Neeva AI Mental Health Companion'
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: openRouterMessages,
          max_tokens: 300,
          temperature: 0.7,
          top_p: 0.9
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = `OpenRouter API error: ${response.status} ${response.statusText}`;

        if (response.status === 401) {
          errorMessage = 'OpenRouter API authentication failed. Please verify your API key is valid.';
        } else if (response.status === 429) {
          errorMessage = 'OpenRouter API rate limit exceeded. Please wait before making more requests.';
        } else if (response.status === 400) {
          errorMessage = 'OpenRouter API request failed. Please check your configuration.';
        }

        const error = new OpenRouterError(errorMessage, response.status, errorData);

        if (response.status === 401 || response.status === 403) {
          throw error;
        }

        lastError = error;

        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt - 1) * 1000;
          console.warn(`OpenRouter API attempt ${attempt} failed, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        throw error;
      }

      const data: OpenRouterResponse = await response.json();

      if (!data.choices || data.choices.length === 0 || !data.choices[0].message.content) {
        throw new OpenRouterError('No response generated from OpenRouter API');
      }

      console.log('✅ OpenRouter xAI Grok API response received successfully');
      console.log(`Tokens used: ${data.usage?.total_tokens || 'unknown'}`);

      return data.choices[0].message.content.trim();

    } catch (error) {
      if (error instanceof OpenRouterError) {
        lastError = error;
        if (error.statusCode === 401 || error.statusCode === 403) {
          throw error;
        }
      }

      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt - 1) * 1000;
        console.warn(`OpenRouter API attempt ${attempt} failed, retrying in ${delay}ms...`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      if (error instanceof OpenRouterError) {
        throw error;
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new OpenRouterError('Network error: Unable to connect to OpenRouter API. Please check your internet connection.');
      }

      throw new OpenRouterError(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  throw lastError || new OpenRouterError('Unknown error occurred');
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

// Utility function to convert chat history to OpenRouter format
export function convertChatHistoryToOpenRouter(chatHistory: Array<{content: string, isUser: boolean}>): OpenRouterMessage[] {
  return chatHistory.map(msg => ({
    role: msg.isUser ? 'user' : 'assistant',
    content: msg.content
  }));
}
