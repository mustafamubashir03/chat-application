import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export interface AuthRequest extends Request {
  user?: mongoose.Types.ObjectId;
}
