import Queue from 'bull';
import { REDIS_PORT, REDIS_URL } from '../config/redisConfig';
export const mailQueue = new Queue('mail', {
  redis: { port: REDIS_PORT, host: REDIS_URL }
});
