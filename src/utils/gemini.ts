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

// No API key in frontend - always use backend proxy for security
console.log('🔒 Using secure backend proxy for OpenRouter API');

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

RESPONSE FORMATTING RULES (STRICT):
To ensure your advice is easy to read and digest, you MUST follow these formatting rules:

1.  **Use Markdown:** Always use Markdown formatting to structure your response.
2.  **Headings:** Use bold text (**Title**) or small headers (###) to separate different sections of your answer.
3.  **Bullet Points:** Use bullet points for lists, steps, or tips. Avoid long, comma-separated lists in a single paragraph.
4.  **Short Paragraphs:** Keep paragraphs short (2-3 sentences max). Avoid "walls of text".
5.  **Bold Key Concepts:** Bold important words or phrases to make them stand out.
6.  **Clear Structure:**
    *   **Introduction:** A warm, validating opening.
    *   **Main Content:** Structured advice, facts, or steps (using bullets/bolding).
    *   **Conclusion:** A supportive closing or a gentle question to keep the conversation going.

CRISIS PROTOCOL:
If the user mentions self-harm, suicide, or severe danger, drop the humor immediately. Respond with serious, compassionate urgency and provide resources.

Your goal is to be the most helpful, supportive, and knowledgeable friend the user has. Go be amazing! 💜`;

// Format response to ensure proper structure
function formatResponse(text: string): string {
  return text.trim();
}

// Helper function for exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000,
  backoff: number = 2
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    // Only retry on 429 (Rate Limit) or 503 (Service Unavailable)
    const shouldRetry =
      retries > 0 &&
      (error.status === 429 || error.status === 503 || error.message?.includes('429') || error.message?.includes('503'));

    if (shouldRetry) {
      console.log(`⚠️ API Error ${error.status}. Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryWithBackoff(fn, retries - 1, delay * backoff, backoff);
    }
    throw error;
  }
}

// Call OpenRouter API with Neeva system instruction
export async function callGemini(messages: GeminiMessage[]): Promise<string> {
  const performApiCall = async () => {
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

    // Always use backend proxy for security (API key is never exposed to frontend)
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: allMessages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new GeminiError(errorData.error || `API Error: ${response.statusText}`, response.status);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    return formatResponse(content);
  };

  try {
    return await retryWithBackoff(performApiCall);
  } catch (error: any) {
    console.error('❌ API Error:', error);

    // Handle network errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      throw new GeminiError('Network error: Unable to connect to API. Please check your internet connection.');
    }

    // Handle API errors with status codes
    if (error.status || error.statusCode) {
      throw new GeminiError(
        error.message || 'API error',
        error.status || error.statusCode,
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

