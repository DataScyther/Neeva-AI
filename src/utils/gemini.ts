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

// Properly access Vite environment variables for Gemini
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.0-flash";
const GEMINI_BASE_URL = import.meta.env.VITE_GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta";

// Fallback to OpenRouter if Gemini is not configured
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";
const OPENROUTER_MODEL = import.meta.env.VITE_OPENROUTER_MODEL || "x-ai/grok-4-fast:free";
const OPENROUTER_BASE_URL = import.meta.env.VITE_OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";

// Determine which API to use - PRIORITIZE xAI Grok for better limits and context
const USE_OPENROUTER_PRIMARY = !!OPENROUTER_API_KEY;
const USE_GEMINI_FALLBACK = !!GEMINI_API_KEY;

// Debug log to check API configuration
console.log('xAI Grok API loaded:', OPENROUTER_API_KEY ? 'Yes' : 'No');
console.log('Gemini API loaded:', GEMINI_API_KEY ? 'Yes' : 'No');
console.log('Primary API: xAI Grok (2M context, higher limits)');
console.log('Fallback API: Google Gemini (1M context, 60 req/min)');

export class GeminiError extends Error {
  constructor(message: string, public statusCode?: number, public response?: any) {
    super(message);
    this.name = 'GeminiError';
  }
}

export async function callGemini(messages: GeminiMessage[]): Promise<string> {
  if (!USE_OPENROUTER_PRIMARY && !USE_GEMINI_FALLBACK) {
    throw new GeminiError('AI chat is temporarily unavailable. You can still use mood tracking, exercises, and meditation features!');
  }

  const maxRetries = 3;
  let lastError: GeminiError | null = null;

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

  // Try xAI Grok first (primary API with better limits)
  if (USE_OPENROUTER_PRIMARY) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Trying xAI Grok API (attempt ${attempt}/${maxRetries})`);

        const openRouterMessages = [
          { role: 'user', content: systemPrompt },
          { role: 'assistant', content: "I understand. I'm Neeva, your compassionate AI companion, here to provide emotional support and guidance. How can I help you today? 💜" },
          ...messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.parts[0]?.text || ''
          }))
        ];

        const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Neeva AI'
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
          let errorMessage = `xAI Grok API error: ${response.status} ${response.statusText}`;

          if (response.status === 401) {
            errorMessage = 'xAI Grok API authentication failed. Please verify your API key.';
          } else if (response.status === 429) {
            errorMessage = 'xAI Grok API rate limit exceeded. Please wait before making more requests.';
          }

          const error = new GeminiError(errorMessage, response.status, errorData);

          if (response.status === 401 || response.status === 403) {
            throw error;
          }

          lastError = error;

          if (attempt < maxRetries) {
            const delay = Math.pow(2, attempt - 1) * 1000;
            console.warn(`xAI Grok API attempt ${attempt} failed, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }

          throw error;
        }

        const data: any = await response.json();

        if (!data.choices || data.choices.length === 0 || !data.choices[0].message.content) {
          throw new GeminiError('No response generated from xAI Grok API');
        }

        console.log('✅ xAI Grok API response received successfully');
        return data.choices[0].message.content.trim();

      } catch (error) {
        if (error instanceof GeminiError) {
          lastError = error;
          if (error.statusCode === 401 || error.statusCode === 403) {
            throw error;
          }
        }

        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt - 1) * 1000;
          console.warn(`xAI Grok API attempt ${attempt} failed, retrying in ${delay}ms...`, error);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        if (error instanceof GeminiError) {
          throw error;
        }

        if (error instanceof TypeError && error.message.includes('fetch')) {
          throw new GeminiError('Network error: Unable to connect to xAI Grok API. Please check your internet connection.');
        }

        throw new GeminiError(`Unexpected error with xAI Grok API: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  // Fallback to Gemini if xAI Grok fails or isn't configured
  if (USE_GEMINI_FALLBACK) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Trying Gemini API as fallback (attempt ${attempt}/${maxRetries})`);

        const geminiMessages = [
          {
            role: 'user' as const,
            parts: [{ text: systemPrompt }]
          },
          {
            role: 'model' as const,
            parts: [{ text: "I understand. I'm Neeva, your compassionate AI companion, here to provide emotional support and guidance. How can I help you today? 💜" }]
          },
          ...messages
        ];

        const url = `${GEMINI_BASE_URL}/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: geminiMessages,
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.9,
              maxOutputTokens: 300,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_ONLY_HIGH"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_ONLY_HIGH"
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_ONLY_HIGH"
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_ONLY_HIGH"
              }
            ]
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          let errorMessage = `Gemini API error: ${response.status} ${response.statusText}`;

          if (response.status === 401 || response.status === 403) {
            errorMessage = 'Gemini API authentication failed. Please verify your API key is valid.';
          } else if (response.status === 429) {
            errorMessage = 'Gemini API rate limit exceeded. Please wait before making more requests.';
          }

          const error = new GeminiError(errorMessage, response.status, errorData);

          if (response.status === 401 || response.status === 403) {
            throw error;
          }

          lastError = error;

          if (attempt < maxRetries) {
            const delay = Math.pow(2, attempt - 1) * 1000;
            console.warn(`Gemini API attempt ${attempt} failed, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }

          throw error;
        }

        const data: GeminiResponse = await response.json();

        if (!data.candidates || data.candidates.length === 0) {
          throw new GeminiError('No response generated from Gemini API');
        }

        const candidate = data.candidates[0];
        if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
          throw new GeminiError('Empty response from Gemini API');
        }

        console.log('✅ Gemini API response received successfully');
        return candidate.content.parts[0].text.trim();

      } catch (error) {
        if (error instanceof GeminiError) {
          lastError = error;
          if (error.statusCode === 401 || error.statusCode === 403) {
            throw error;
          }
        }

        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt - 1) * 1000;
          console.warn(`Gemini API attempt ${attempt} failed, retrying in ${delay}ms...`, error);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        if (error instanceof GeminiError) {
          throw error;
        }

        if (error instanceof TypeError && error.message.includes('fetch')) {
          throw new GeminiError('Network error: Unable to connect to Gemini API. Please check your internet connection.');
        }

        throw new GeminiError(`Unexpected error with Gemini API: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  throw lastError || new GeminiError('All AI APIs failed or are not configured');
}

// Utility function to convert chat history to Gemini format
export function convertChatHistoryToGemini(chatHistory: Array<{content: string, isUser: boolean}>): GeminiMessage[] {
  return chatHistory.map(msg => ({
    role: msg.isUser ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));
}