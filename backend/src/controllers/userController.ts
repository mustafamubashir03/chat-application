import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { signinService, signupService } from '../services/userService';
import {
  ClientError,
  customErrorResponse,
  internalServerErrorResponse,
  successResponse
} from '../utils/ObjectResponse';
import { MongooseError } from 'mongoose';
import { jwtGenerate } from '../auth/auth';

export const signUp = async (req: Request, res: Response) => {
  try {
    const newUser = await signupService(req.body);
    res
      .status(StatusCodes.CREATED)
      .json(successResponse(newUser, 'User has been created successfully'));
  } catch (error: any) {
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(400).json({ success: false, message: "Email already exists" })
    }
    if (error instanceof MongooseError) {
      res.status(StatusCodes.BAD_REQUEST).json(error);
      return;
    }
    console.log(error);
    if (error.statusCode) {
      res.status(error.statusCode).json(customErrorResponse(error.message));
      return;
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrorResponse(error));
    return;
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const userFound = await signinService(req.body);
    if (!userFound) {
      throw new ClientError({
        explanation: 'Invalid data from the client',
        message: 'User not Found',
        status: StatusCodes.BAD_REQUEST
      });
    }
    const isMatched = bcrypt.compareSync(req.body.password, userFound.password);
    if (!isMatched) {
      throw new ClientError({
        explanation: 'Invalid data from the client',
        message: 'Incorrect password',
        status: StatusCodes.BAD_REQUEST
      });
    }
    res.status(StatusCodes.OK).json({
      username: userFound.username,
      avatar: userFound.avatar,
      email: userFound.email,
      token: jwtGenerate({ id: userFound._id, email: userFound.email })
    });
  } catch (error: any) {
    if (error instanceof MongooseError) {
      res.status(StatusCodes.BAD_REQUEST).json(error.message);
      return;
    }
    console.log(error);
    if (error.statusCode) {
      res.status(error.statusCode).json(customErrorResponse(error));
      return;
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrorResponse(error));
    return;
  }
};
