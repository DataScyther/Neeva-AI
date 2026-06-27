/**
 * NVIDIA NIM — AI Provider Implementation
 *
 * Communicates with the NVIDIA NIM API via the Vercel backend proxy (/api/ai/chat).
 * Never communicates directly with NVIDIA — always goes through the backend.
 */

import type { AIProvider, AIStreamParams, AICompleteParams, AIResponse, StreamChunk } from '../types';
import { AIError } from '../types';

export class NvidiaProvider implements AIProvider {
  readonly name = 'nvidia-nim';

  async *streamChat(params: AIStreamParams): AsyncGenerator<StreamChunk> {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-uid': params.uid,
      },
      body: JSON.stringify({
        text: params.text,
        history: params.history,
      }),
      signal: params.signal,
    });

    if (!res.ok || !res.body) {
      const errText = await res.text().catch(() => '');
      throw new AIError('AI request failed', res.status, errText);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (!value) continue;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        try {
          const parsed = JSON.parse(trimmed) as StreamChunk;
          yield parsed;
          if (parsed.done) return;
        } catch {
          // Ignore malformed lines
        }
      }
    }

    if (buffer.trim()) {
      try {
        const parsed = JSON.parse(buffer.trim()) as StreamChunk;
        yield parsed;
      } catch {
        // ignore
      }
    }
  }

  async generateResponse(params: AICompleteParams): Promise<AIResponse> {
    let content = '';
    for await (const chunk of this.streamChat(params)) {
      content += chunk.contentDelta;
    }
    return { content };
  }
}

export default NvidiaProvider;
