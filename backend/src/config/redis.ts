import { createClient } from 'redis';
import { env } from './env';

export const redisClient = env.REDIS_URL ? createClient({ url: env.REDIS_URL }) : null;
