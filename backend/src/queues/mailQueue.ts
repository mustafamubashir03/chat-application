import Queue from 'bull';
import { REDIS_URL } from '../config/redisConfig.js';
export const mailQueue = new Queue('mail',REDIS_URL);
