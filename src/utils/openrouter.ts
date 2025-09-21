// OpenRouter API integration for AI companion
import { checkEnvVariables } from './env-check';

export interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

const API_KEY = (import.meta as any).env.VITE_OPENROUTER_API_KEY;
const MODEL = (import.meta as any).env.VITE_OPENROUTER_MODEL || 'x-ai/grok-4-fast:free';
const BASE_URL = (import.meta as any).env.VITE_OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

// Check environment variables on module load
const envCheck = checkEnvVariables();
if (!envCheck.isValid) {
  console.error('OpenRouter API environment errors:', envCheck.errors.join(', '));
}
if (envCheck.warnings.length > 0) {
  console.warn('OpenRouter API environment warnings:', envCheck.warnings.join(', '));
}

export class OpenRouterError extends Error {
  constructor(message: string, public statusCode?: number, public response?: any) {
    super(message);
    this.name = 'OpenRouterError';
  }
}

export async function callOpenRouter(messages: OpenRouterMessage[]): Promise<string> {
  // More detailed API key validation
  if (!API_KEY) {
    throw new OpenRouterError('OpenRouter API key is not configured. Please set VITE_OPENROUTER_API_KEY in your environment variables.');
  }
  
  // Check if API key has the correct format
  if (!API_KEY.startsWith('sk-or-v1-')) {
    throw new OpenRouterError('OpenRouter API key format is invalid. It should start with "sk-or-v1-".');
  }

  try {
    const systemPrompt: OpenRouterMessage = {
      role: 'system',
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

    const fullMessages = [systemPrompt, ...messages];

    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Neeva Mental Health App'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: fullMessages,
        max_tokens: 300,
        temperature: 0.7,
        top_p: 0.9,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      let errorMessage = `OpenRouter API error: ${response.status} ${response.statusText}`;
      
      // Provide more specific error messages for common status codes
      if (response.status === 401) {
        errorMessage = 'OpenRouter API authentication failed. Please check your API key.';
      } else if (response.status === 403) {
        errorMessage = 'OpenRouter API access forbidden. Your API key may not have permission to access this model.';
      } else if (response.status === 429) {
        errorMessage = 'OpenRouter API rate limit exceeded. Please wait before making more requests.';
      }
      
      throw new OpenRouterError(
        errorMessage,
        response.status,
        errorData
      );
    }

    const data: OpenRouterResponse = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new OpenRouterError('No response generated from OpenRouter API');
    }

    return data.choices[0].message.content.trim();

  } catch (error) {
    if (error instanceof OpenRouterError) {
      throw error;
    }
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new OpenRouterError('Network error: Unable to connect to OpenRouter API. Please check your internet connection.');
    }
    
    throw new OpenRouterError(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Utility function to convert chat history to OpenRouter format
export function convertChatHistory(chatHistory: Array<{content: string, isUser: boolean}>): OpenRouterMessage[] {
  return chatHistory.map(msg => ({
    role: msg.isUser ? 'user' : 'assistant',
    content: msg.content
  }));
}