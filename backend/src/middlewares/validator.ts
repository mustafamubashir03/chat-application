import { StatusCodes } from 'http-status-codes';
import {
  customErrorResponse,
  internalServerErrorResponse
} from '../utils/ObjectResponse';
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { MongooseError } from 'mongoose';

export const validator = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({
            message: result.error.issues.map((issue) => ({
              message: issue.message,
              field: issue.path.join('.')
            }))
          });
        return;
      }
      next();
    } catch (error: any) {
      if (error instanceof MongooseError) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json(error.message);
        return;
      }
      console.log(error);
      if (error.statusCode) {
        res.status(error.statusCode).json(customErrorResponse(error));
      }
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(internalServerErrorResponse(error));
    }
  };
};
