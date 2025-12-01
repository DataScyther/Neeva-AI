// OpenRouter API integration for AI companion

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

export class OpenRouterError extends Error {
  constructor(message: string, public statusCode?: number, public response?: any) {
    super(message);
    this.name = 'OpenRouterError';
  }
}

/**
 * Sends chat messages to the local proxy server which forwards them to OpenRouter.
 * The proxy endpoint is /api/openrouter.
 */
export async function callOpenRouter(messages: OpenRouterMessage[]): Promise<string> {
  try {
    const response = await fetch('/api/openrouter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      let errorMessage = `Proxy server error: ${response.status} ${response.statusText}`;
      if (response.status === 400) {
        errorMessage = 'Invalid request sent to proxy server.';
      }
      throw new OpenRouterError(errorMessage, response.status, errorData);
    }

    const data: OpenRouterResponse = await response.json();
    if (!data.choices || data.choices.length === 0) {
      throw new OpenRouterError('No response generated from proxy server');
    }

    console.log('✅ Proxy server response received successfully');
    return formatResponse(data.choices[0].message.content);
  } catch (error) {
    if (error instanceof OpenRouterError) {
      throw error;
    }
    throw new OpenRouterError(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Response formatting utilities
export function formatResponse(response: string): string {
  let formatted = response
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+\./g, '.')
    .replace(/\s+,/g, ',')
    .replace(/\s+\?/g, '?')
    .replace(/\s+!/g, '!');

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