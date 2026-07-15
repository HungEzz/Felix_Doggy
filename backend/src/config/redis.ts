import Redis from 'ioredis';
import { env } from './env';

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  tls: env.REDIS_URL.startsWith('rediss://') ? {} : undefined,
  retryStrategy: (times) => {
    const delay = Math.min(500 * Math.pow(2, times - 1), 10000);
    console.warn(`⚠️ [Redis Retry] Attempt ${times} — retrying connection in ${delay}ms`);
    return delay;
  },
  reconnectOnError: (err) => {
    const reconnectErrors = ['READONLY', 'ECONNRESET', 'ECONNREFUSED'];
    return reconnectErrors.some((e) => err.message.includes(e));
  },
});

let connected = false;

redis.on('connect', () => {
  connected = true;
  console.log('✅ Redis connected successfully');
});

redis.on('ready', () => {
  connected = true;
  console.log('✅ Redis ready — cache layer is active');
});

redis.on('error', (err) => {
  connected = false;
  console.warn('⚠️ Redis connection error (app will fallback to PostgreSQL):', err.message);
});

redis.on('reconnecting', () => {
  console.warn('🔄 [Redis Retry] Reconnecting to Redis...');
});

export const isRedisConnected = () => connected;
