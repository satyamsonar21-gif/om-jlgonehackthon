import { SetMetadata } from '@nestjs/common';

export interface RateLimitOptions {
  limit: number; // Maximum allowed requests
  ttlMs: number; // Time window in milliseconds
  message?: string; // Custom error message
}

export const RATE_LIMIT_KEY = 'rate_limit_options';

export const RateLimit = (limit: number, ttlSeconds: number = 60, message?: string) =>
  SetMetadata(RATE_LIMIT_KEY, {
    limit,
    ttlMs: ttlSeconds * 1000,
    message,
  } as RateLimitOptions);
