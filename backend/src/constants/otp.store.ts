import Redis from 'ioredis';

const REDIS_ENABLED = process.env.REDIS_ENABLED === 'true';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const OTP_TTL_SECONDS = 60 * 5;

const memoryOtpStore = new Map<string, { value: string; expiresAt: number }>();
let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  if (!REDIS_ENABLED) return null;
  if (redisClient) return redisClient;

  redisClient = new Redis(REDIS_URL, {
    lazyConnect: true,
    enableOfflineQueue: false,
    maxRetriesPerRequest: 1,
    retryStrategy: () => null,
  });

  // Prevent unhandled ioredis error spam when Redis is unavailable.
  redisClient.on('error', () => {});
  return redisClient;
}

export async function setOtp(email: string, otp: string): Promise<void> {
  const client = getRedisClient();
  if (client) {
    try {
      await client.connect();
      await client.set(email, otp, 'EX', OTP_TTL_SECONDS);
      return;
    } catch {
      // fallback below
    }
  }

  memoryOtpStore.set(email, {
    value: otp,
    expiresAt: Date.now() + OTP_TTL_SECONDS * 1000,
  });
}

export async function getOtp(email: string): Promise<string | null> {
  const client = getRedisClient();
  if (client) {
    try {
      await client.connect();
      return await client.get(email);
    } catch {
      // fallback below
    }
  }

  const entry = memoryOtpStore.get(email);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryOtpStore.delete(email);
    return null;
  }
  return entry.value;
}

export async function deleteOtp(email: string): Promise<void> {
  const client = getRedisClient();
  if (client) {
    try {
      await client.connect();
      await client.del(email);
      return;
    } catch {
      // fallback below
    }
  }

  memoryOtpStore.delete(email);
}
