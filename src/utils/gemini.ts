// Google Gemini API integration for AI companion
import { checkEnvVariables } from './env-check';

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
    };
  }>;
}

const API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY;
const MODEL = (import.meta as any).env.VITE_GEMINI_MODEL || 'gemini-2.0-flash';
const BASE_URL = (import.meta as any).env.VITE_GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta';

// Debug logging
console.log('=== Gemini Config Debug ===');
console.log('API_KEY exists:', !!API_KEY);
console.log('API_KEY value:', API_KEY ? `${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 5)}` : 'NOT SET');
console.log('MODEL:', MODEL);
console.log('BASE_URL:', BASE_URL);

export class GeminiError extends Error {
  constructor(message: string, public statusCode?: number, public response?: any) {
    super(message);
    this.name = 'GeminiError';
  }
}

export async function callGemini(messages: GeminiMessage[]): Promise<string> {
  if (!API_KEY) {
    throw new GeminiError('Google Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your environment variables.');
  }

  try {
    // Convert messages to Gemini format
    const contents = messages.map(msg => ({
      role: msg.role,
      parts: msg.parts
    }));

    // Add system prompt as first user message
    const systemPrompt: GeminiMessage = {
      role: 'user',
      parts: [{
        text: `You are Neeva, a compassionate AI mental health companion. Your role is to:
        
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
      }]
    };

    const fullContents = [systemPrompt, ...contents];

    const response = await fetch(`${BASE_URL}/models/${MODEL}:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: fullContents,
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.7,
          topP: 0.9
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      let errorMessage = `Google Gemini API error: ${response.status} ${response.statusText}`;
      
      // Provide more specific error messages for common status codes
      if (response.status === 401) {
        errorMessage = 'Google Gemini API authentication failed. Please verify your API key is valid and properly configured.';
      } else if (response.status === 403) {
        errorMessage = 'Google Gemini API access forbidden. Your API key may not have permission to access this model.';
      } else if (response.status === 429) {
        errorMessage = 'Google Gemini API rate limit exceeded. Please wait before making more requests.';
      }
      
      throw new GeminiError(
        errorMessage,
        response.status,
        errorData
      );
    }

    const data: GeminiResponse = await response.json();
    
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content.parts[0].text) {
      throw new GeminiError('No response generated from Google Gemini API');
    }

    return data.candidates[0].content.parts[0].text.trim();

  } catch (error) {
    if (error instanceof GeminiError) {
      throw error;
    }
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new GeminiError('Network error: Unable to connect to Google Gemini API. Please check your internet connection.');
    }
    
    throw new GeminiError(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Utility function to convert chat history to Gemini format
export function convertChatHistoryToGemini(chatHistory: Array<{content: string, isUser: boolean}>): GeminiMessage[] {
  return chatHistory.map(msg => ({
    role: msg.isUser ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));
}