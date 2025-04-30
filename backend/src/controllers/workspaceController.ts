import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MongooseError } from 'mongoose';
import {
  customErrorResponse,
  internalServerErrorResponse
} from '../utils/ObjectResponse';
import { createWorkspaceService } from '../services/workspaceService';

export const createWorkspaceController = async (
  req: Request,
  res: Response
) => {
  try {
    const response = await createWorkspaceService({
      ...req.body,
      owner: req.user
    });
    res.status(StatusCodes.OK).json(response);
  } catch (error: any) {
    if (error instanceof MongooseError) {
      res.status(StatusCodes.BAD_REQUEST).json(error);
      return;
    }
    console.log(error);
    if (error.statusCode) {
      res.status(error.statusCode).json(customErrorResponse(error.message));
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrorResponse(error));
    return;
  }
};
