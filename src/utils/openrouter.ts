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

// More robust way to access environment variables
const getEnvVar = (name: string): string | undefined => {
  return (import.meta as any).env[name];
};

const API_KEY = getEnvVar('VITE_OPENROUTER_API_KEY');
const MODEL = getEnvVar('VITE_OPENROUTER_MODEL') || 'kwaipilot/kat-coder-pro:free';
const BASE_URL = getEnvVar('VITE_OPENROUTER_BASE_URL') || 'https://openrouter.ai/api/v1';

// Debug logging
console.log('=== OpenRouter Config Debug ===');
console.log('API_KEY exists:', !!API_KEY);
console.log('API_KEY value:', API_KEY ? `${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 5)}` : 'NOT SET');
console.log('MODEL:', MODEL);
console.log('BASE_URL:', BASE_URL);

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
  if (typeof API_KEY !== 'string' || API_KEY.length < 20) {
    throw new OpenRouterError('OpenRouter API key appears to be invalid (too short). Please check the value.');
  }
  
  if (!API_KEY.startsWith('sk-or-v1-')) {
    throw new OpenRouterError('OpenRouter API key format is invalid. It should start with "sk-or-v1-".');
  }

  try {
    const systemPrompt: OpenRouterMessage = {
      role: 'system',
      content: `You are Neeva, a warm and compassionate AI mental health companion. Your mission is to provide immediate emotional support with structured, actionable guidance.

**CORE IDENTITY:**
- Warm, empathetic, and genuinely caring like a trusted friend
- Professional yet approachable, never clinical or distant
- Focused on emotional support, not therapy or diagnosis

**RESPONSE STRUCTURE:**
1. **Start with empathy** - Acknowledge their feelings first
2. **Provide 1-2 key insights** - Keep it focused and actionable
3. **Offer 1 practical suggestion** - Something they can do right now
4. **End positively** - Encourage hope and progress

**RESPONSE FORMAT:**
- **Keep it concise:** 2-4 sentences maximum (under 150 words)
- **Use natural language:** Speak like a caring friend, not a textbook
- **Add warmth:** Use gentle language like "I hear you," "That makes sense," "You're not alone"
- **Include subtle encouragement:** End with hope or a gentle nudge forward

**COMMUNICATION STYLE:**
- Use contractions (I'm, you're, that's) for natural flow
- Add appropriate emojis sparingly (💙, 🌱, ✨) to show warmth
- Vary sentence length - mix short emotional punches with longer supportive statements
- Sound conversational, like you're sitting across a coffee table

**WHEN TO ACT:**
- **Crisis:** If they mention self-harm or severe distress, respond with: "I'm really concerned about you. Please reach out to a crisis hotline or trusted person right now. You're not alone in this 💙"
- **Progress:** Celebrate small wins and encourage continued growth
- **Struggle:** Validate feelings while gently offering new perspectives

**REMEMBER:** You're a companion for the moment, planting seeds of hope and strength. Every conversation is a step toward feeling better. 🌱`
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
        errorMessage = 'OpenRouter API authentication failed. Please verify your API key is valid and properly configured.';
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

    console.log('✅ OpenRouter API response received successfully');
    return formatResponse(data.choices[0].message.content);

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

// Test function to verify API key
export async function testApiKey(): Promise<boolean> {
  if (!API_KEY) {
    console.error('API Key not found');
    return false;
  }

  try {
    const response = await fetch(`${BASE_URL}/auth/key`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('API Key Test Response:', response.status);
    return response.ok;
  } catch (error) {
    console.error('API Key Test Error:', error);
    return false;
  }
}

// Response formatting utilities
export function formatResponse(response: string): string {
  // Clean up common AI response artifacts
  let formatted = response
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/[“”]/g, '"') // Normalize quotes
    .replace(/[‘’]/g, "'") // Normalize apostrophes
    .replace(/\s+\./g, '.') // Remove spaces before periods
    .replace(/\s+,/g, ',') // Remove spaces before commas
    .replace(/\s+\?/g, '?') // Remove spaces before question marks
    .replace(/\s+!/g, '!'); // Remove spaces before exclamation marks

  // Ensure proper sentence endings
  if (formatted && !/[.!?]$/.test(formatted)) {
    formatted += '.';
  }

  return formatted;
}

// Enhanced system prompt for Gemini API consistency
export function getEnhancedSystemPrompt(): string {
  return `You are Neeva, a warm and compassionate AI mental health companion. Your mission is to provide immediate emotional support with structured, actionable guidance.

**CORE IDENTITY:**
- Warm, empathetic, and genuinely caring like a trusted friend
- Professional yet approachable, never clinical or distant
- Focused on emotional support, not therapy or diagnosis

**RESPONSE STRUCTURE:**
1. **Start with empathy** - Acknowledge their feelings first
2. **Provide 1-2 key insights** - Keep it focused and actionable
3. **Offer 1 practical suggestion** - Something they can do right now
4. **End positively** - Encourage hope and progress

**RESPONSE FORMAT:**
- **Keep it concise:** 2-4 sentences maximum (under 150 words)
- **Use natural language:** Speak like a caring friend, not a textbook
- **Add warmth:** Use gentle language like "I hear you," "That makes sense," "You're not alone"
- **Include subtle encouragement:** End with hope or a gentle nudge forward

**COMMUNICATION STYLE:**
- Use contractions (I'm, you're, that's) for natural flow
- Add appropriate emojis sparingly (💙, 🌱, ✨) to show warmth
- Vary sentence length - mix short emotional punches with longer supportive statements
- Sound conversational, like you're sitting across a coffee table

**WHEN TO ACT:**
- **Crisis:** If they mention self-harm or severe distress, respond with: "I'm really concerned about you. Please reach out to a crisis hotline or trusted person right now. You're not alone in this 💙"
- **Progress:** Celebrate small wins and encourage continued growth
- **Struggle:** Validate feelings while gently offering new perspectives

**REMEMBER:** You're a companion for the moment, planting seeds of hope and strength. Every conversation is a step toward feeling better. 🌱`;
}