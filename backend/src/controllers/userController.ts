import { userSchemaCreateZod } from '@itz____mmm/common';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { signupService } from '../services/userService';
import {
  customErrorResponse,
  internalServerErrorResponse,
  successResponse
} from '../utils/ObjectResponse';

export const signUp = async (req: Request, res: Response) => {
  try {
    const signupData = req.body;
    const result = userSchemaCreateZod.safeParse(signupData);
    if (!result.success) {
      return;
    }
    const newUser = await signupService(signupData);
    res
      .status(StatusCodes.CREATED)
      .json(successResponse(newUser, 'User has been created successfully'));
  } catch (error: any) {
    console.log('User controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrorResponse(error));
  }
};
