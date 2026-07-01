import { storageService } from '@/services/storage';
import type { JourneyProgress } from '../types/JourneyProgress';

const CACHE_KEY = 'journey:active';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry {
  data: JourneyProgress;
  cachedAt: number;
}

export class JourneyCache {
  async get(): Promise<JourneyProgress | null> {
    try {
      const entry = await storageService.getJSON<CacheEntry>(CACHE_KEY);
      if (!entry) return null;
      if (Date.now() - entry.cachedAt > CACHE_TTL) {
        await this.clear();
        return null;
      }
      return entry.data;
    } catch {
      return null;
    }
  }

  async set(journey: JourneyProgress): Promise<void> {
    try {
      const entry: CacheEntry = { data: journey, cachedAt: Date.now() };
      await storageService.setJSON(CACHE_KEY, entry);
    } catch (error) {
      console.error('Error caching journey:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      await storageService.delete(CACHE_KEY);
    } catch {
      // ignore
    }
  }
}

export const journeyCache = new JourneyCache();
export default journeyCache;
