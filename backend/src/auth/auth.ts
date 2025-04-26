import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { JWT_EXPIRY, JWT_SECRET } from '../config/serverConfig';


dotenv.config();

export const jwtGenerate = (payload:any) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};
