import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RATE_LIMIT_KEY, RateLimitOptions } from '../decorators/rate-limit.decorator';

interface RequestBucket {
  timestamps: number[];
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  private static store: Map<string, RequestBucket> = new Map();
  private static lastCleanup: number = Date.now();

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const options = this.reflector.getAllAndOverride<RateLimitOptions>(RATE_LIMIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!options) {
      return true; // No rate limit specified on this route
    }

    const request = context.switchToHttp().getRequest();
    const clientIp =
      request.ip ||
      (request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      request.socket?.remoteAddress ||
      'unknown_ip';

    const routePath = request.route?.path || request.url;
    const bucketKey = `${clientIp}:${routePath}`;
    const now = Date.now();

    // Periodic cleanup of stale records every 5 minutes
    if (now - RateLimitGuard.lastCleanup > 5 * 60 * 1000) {
      RateLimitGuard.cleanup(now);
      RateLimitGuard.lastCleanup = now;
    }

    let bucket = RateLimitGuard.store.get(bucketKey);
    if (!bucket) {
      bucket = { timestamps: [] };
      RateLimitGuard.store.set(bucketKey, bucket);
    }

    // Filter out timestamps outside the sliding window
    const windowStart = now - options.ttlMs;
    bucket.timestamps = bucket.timestamps.filter((ts) => ts > windowStart);

    if (bucket.timestamps.length >= options.limit) {
      const retryAfterSeconds = Math.ceil(
        (bucket.timestamps[0] + options.ttlMs - now) / 1000,
      );

      const response = context.switchToHttp().getResponse();
      if (response && response.setHeader) {
        response.setHeader('Retry-After', retryAfterSeconds.toString());
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          error: 'Too Many Requests',
          message:
            options.message ||
            `Rate limit exceeded. Please try again in ${retryAfterSeconds} seconds.`,
          retryAfter: retryAfterSeconds,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    bucket.timestamps.push(now);
    return true;
  }

  private static cleanup(now: number) {
    const maxRetention = 15 * 60 * 1000; // 15 minutes
    for (const [key, bucket] of RateLimitGuard.store.entries()) {
      bucket.timestamps = bucket.timestamps.filter((ts) => now - ts < maxRetention);
      if (bucket.timestamps.length === 0) {
        RateLimitGuard.store.delete(key);
      }
    }
  }

  // Helper for test cleanup
  public static reset() {
    RateLimitGuard.store.clear();
  }
}
