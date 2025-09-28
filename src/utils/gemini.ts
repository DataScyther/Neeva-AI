// OpenRouter API integration for AI companion (formerly Gemini)
import { checkEnvVariables } from './env-check';

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: Array<{
    text: string;
  }>;
}

export interface GeminiResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const DEFAULT_MODEL = 'google/gemini-2.0-flash-exp:free';
const DEFAULT_BASE_URL = 'https://openrouter.ai/api/v1';

const env = ((import.meta as unknown as { env?: Record<string, string> })?.env) ?? {};
const API_KEY = env.VITE_OPENROUTER_API_KEY || "";
const MODEL = env.VITE_OPENROUTER_MODEL || DEFAULT_MODEL;
const BASE_URL = env.VITE_OPENROUTER_BASE_URL || DEFAULT_BASE_URL;

export class GeminiError extends Error {
  constructor(message: string, public statusCode?: number, public response?: any) {
    super(message);
    this.name = 'GeminiError';
  }
}

export async function callGemini(messages: GeminiMessage[]): Promise<string> {
  if (!API_KEY) {
    throw new GeminiError('AI chat features are currently unavailable. OpenRouter API is not configured. You can still use other features like mood tracking, exercises, and meditation.');
  }

  const maxRetries = 3;
  let lastError: GeminiError | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Convert messages to OpenRouter format
      const openRouterMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.parts[0]?.text || ''
      }));

      // Add system prompt as first user message
      const systemPrompt = {
        role: 'user',
        content: `You are Neeva, a compassionate AI mental health companion. Your role is to:

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

Remember: You're a companion, not a therapist. Your goal is to provide immediate support and guide users toward professional help when needed.`
      };

      const fullMessages = [systemPrompt, ...openRouterMessages];

      const response = await fetch(`${BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Neeva AI'
        },
        body: JSON.stringify({
          model: MODEL,
          messages: fullMessages,
          max_tokens: 300,
          temperature: 0.7,
          top_p: 0.9
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = `OpenRouter API error: ${response.status} ${response.statusText}`;

        // Provide more specific error messages for common status codes
        if (response.status === 401) {
          errorMessage = 'OpenRouter API authentication failed. Please verify your API key is valid and properly configured.';
        } else if (response.status === 403) {
          errorMessage = 'OpenRouter API access forbidden. Your API key may not have permission to access this model.';
        } else if (response.status === 404) {
          errorMessage = `OpenRouter model '${MODEL}' not found. Please check the model name or try a different model.`;
        } else if (response.status === 429) {
          errorMessage = 'OpenRouter API rate limit exceeded. Please wait before making more requests.';
        } else if (response.status === 503) {
          errorMessage = 'OpenRouter API service temporarily unavailable. This may be a temporary issue.';
        }

        const error = new GeminiError(
          errorMessage,
          response.status,
          errorData
        );

        // Don't retry on authentication or permission errors
        if (response.status === 401 || response.status === 403) {
          throw error;
        }

        lastError = error;

        // If this isn't the last attempt, wait before retrying
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt - 1) * 1000; // Exponential backoff
          console.warn(`OpenRouter API attempt ${attempt} failed with ${response.status}, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        throw error;
      }

      const data: GeminiResponse = await response.json();

      if (!data.choices || data.choices.length === 0 || !data.choices[0].message.content) {
        throw new GeminiError('No response generated from OpenRouter API');
      }

      return data.choices[0].message.content.trim();

    } catch (error) {
      if (error instanceof GeminiError) {
        lastError = error;
        // Don't retry on authentication errors
        if (error.statusCode === 401 || error.statusCode === 403) {
          throw error;
        }
      }

      // If this isn't the last attempt, wait before retrying
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt - 1) * 1000;
        console.warn(`OpenRouter API attempt ${attempt} failed, retrying in ${delay}ms...`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      if (error instanceof GeminiError) {
        throw error;
      }

      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new GeminiError('Network error: Unable to connect to OpenRouter API. Please check your internet connection.');
      }

      throw new GeminiError(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // This should never be reached, but TypeScript requires it
  throw lastError || new GeminiError('Unknown error occurred');
}

// Utility function to convert chat history to Gemini format
export function convertChatHistoryToGemini(chatHistory: Array<{content: string, isUser: boolean}>): GeminiMessage[] {
  return chatHistory.map(msg => ({
    role: msg.isUser ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));
}