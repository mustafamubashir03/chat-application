import Queue from 'bull';
import { REDIS_URL } from '../config/redisConfig';
export const mailQueue = new Queue('mail',REDIS_URL);
