import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/serverConfig';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  customErrorResponse,
  internalServerErrorResponse
} from '../utils/ObjectResponse';
import userRepository from '../repository/userRepository';
import mongoose from 'mongoose';
import { AuthRequest } from '../types/custom';

export const isAuthenticated = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.token;
    if (!token) {
      res.status(StatusCodes.FORBIDDEN).json({ message: 'No token provided' });
      return;
    }
    const response = (await jwt.verify(token as string, JWT_SECRET)) as {
      id: mongoose.Types.ObjectId;
      email: string;
    };
    if (response) {
      const user = await userRepository.getDocById(response.id);
      req.user = user.id;
      next();
    } else {
      res.status(StatusCodes.FORBIDDEN).json({ message: 'Invalid token' });
      return;
    }
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      res.status(StatusCodes.FORBIDDEN).json({ message: 'Invalid token' });
      return;
    }
    if (error.statusCode) {
      res.status(error.statusCode).json(customErrorResponse(error));
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrorResponse(error));
  }
};
