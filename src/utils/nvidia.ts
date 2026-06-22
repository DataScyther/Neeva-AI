import OpenAI from 'openai';
import { buildContextualPrompt, getTimeOfDay } from '../prompts/mentalWellnessPrompt';

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

export interface AIResponse {
  content: string;
  reasoning?: string;
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_NVIDIA_API_KEY || '',
  baseURL: typeof window !== 'undefined' ? `${window.location.origin}/api/nvidia/v1` : 'http://localhost:5175/api/nvidia/v1',
  dangerouslyAllowBrowser: true
});

function getSystemInstruction(): string {
  const userName = typeof window !== 'undefined'
    ? localStorage.getItem('neeva_user_name') || undefined
    : undefined;
  const timeOfDay = getTimeOfDay();

  let preferredTone: 'warm' | 'motivational' | 'soothing' | 'auto' = 'auto';
  if (typeof window !== 'undefined') {
    try {
      const storedData = localStorage.getItem('onboardingData');
      if (storedData) {
        const parsed = JSON.parse(storedData);
        if (parsed.tone) {
          preferredTone = parsed.tone;
        }
      }
    } catch (e) {
      // ignore parse error
    }
  }

  return buildContextualPrompt({
    userName,
    timeOfDay,
    returningUser: typeof window !== 'undefined'
      ? !!localStorage.getItem('neeva_session_count')
      : false,
    preferredTone,
  });
}

function translateToOpenAI(messages: GeminiMessage[]) {
  const openaiMessages: Array<{role: 'system'|'user'|'assistant', content: string}> = [
    { role: 'system', content: getSystemInstruction() }
  ];

  for (const msg of messages) {
    const text = msg.parts?.[0]?.text || '';
    let role: 'user' | 'assistant' = msg.role === 'model' ? 'assistant' : 'user';
    openaiMessages.push({ role, content: text });
  }

  return openaiMessages;
}

export async function callGemini(messages: GeminiMessage[]): Promise<AIResponse> {
  try {
    const openaiMessages = translateToOpenAI(messages);
    const lastUserMessage = messages[messages.length - 1]?.parts?.[0]?.text || '';
    
    // Dynamic routing: 
    // Short inputs get routed to the blazing fast 70B model.
    // Long inputs or paragraphs get routed to the 49B Nemotron model.
    const isShortInput = lastUserMessage.length < 50 && !lastUserMessage.includes('\n');
    
    let modelToUse: string;

    if (isShortInput) {
      // Fast, reliable, and efficient model for quick exchanges (responses in ~0.5s)
      modelToUse = "meta/llama-3.3-70b-instruct";
    } else {
      // Deep but faster model for complex or paragraph-like inputs (responses in ~1.7s)
      modelToUse = "nvidia/llama-3.3-nemotron-super-49b-v1";
    }

    console.log(`🧠 Dynamic Routing: Using ${modelToUse} (Short Input: ${isShortInput})`);

    const completion = await openai.chat.completions.create({
      model: modelToUse,
      messages: openaiMessages as any, // using as any since OpenAI SDK might complain about system role
      temperature: 0.6,
      top_p: 0.95,
      max_tokens: 4096,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: false,
    } as any);
    
    const responseText = completion.choices[0]?.message?.content || '';

    return {
      content: responseText,
    };
  } catch (error: any) {
    console.error('❌ API Error:', error);
    throw new GeminiError(
      error.message || 'API error',
      error.status || 500,
      error
    );
  }
}

export function convertChatHistoryToGemini(chatHistory: Array<{ content: string, isUser: boolean }>): GeminiMessage[] {
  return chatHistory.map(msg => ({
    role: msg.isUser ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));
}
