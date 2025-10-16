import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';

interface CacheEntry {
  response: any;
  timestamp: number;
  ttl: number;
}

@Injectable()
export class LLMCacheService {
  private readonly logger = new Logger(LLMCacheService.name);
  private cache: Map<string, CacheEntry> = new Map();
  private readonly defaultTTL: number;
  private readonly enabled: boolean;

  constructor(private configService: ConfigService) {
    this.defaultTTL =
      this.configService.get<number>('LLM_CACHE_TTL') || 3600000; // 1 hour
    this.enabled =
      this.configService.get<boolean>('LLM_CACHE_ENABLED') ?? true;

    // Clean up expired cache entries every 5 minutes
    if (this.enabled) {
      setInterval(() => this.cleanup(), 300000);
    }
  }

  generateKey(messages: any[], options?: any): string {
    const data = JSON.stringify({ messages, options });
    return createHash('sha256').update(data).digest('hex');
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.enabled) return null;

    const entry = this.cache.get(key);
    if (!entry) {
      this.logger.debug(`Cache miss for key: ${key.substring(0, 16)}...`);
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.logger.debug(`Cache expired for key: ${key.substring(0, 16)}...`);
      return null;
    }

    this.logger.log(`Cache hit for key: ${key.substring(0, 16)}...`);
    return entry.response as T;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    if (!this.enabled) return;

    const entry: CacheEntry = {
      response: value,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    };

    this.cache.set(key, entry);
    this.logger.debug(
      `Cache set for key: ${key.substring(0, 16)}... (TTL: ${entry.ttl}ms)`,
    );
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
    this.logger.debug(`Cache deleted for key: ${key.substring(0, 16)}...`);
  }

  async clear(): Promise<void> {
    this.cache.clear();
    this.logger.log('Cache cleared');
  }

  private cleanup(): void {
    const now = Date.now();
    let count = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        count++;
      }
    }

    if (count > 0) {
      this.logger.log(`Cleaned up ${count} expired cache entries`);
    }
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      enabled: this.enabled,
      defaultTTL: this.defaultTTL,
    };
  }
}
