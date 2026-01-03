import { Response } from 'express';
import { AuthRequest } from '../types/custom';
import { getMessageService } from '../services/messageService';
import { StatusCodes } from 'http-status-codes';
import { MongooseError } from 'mongoose';
import {
  customErrorResponse,
  internalServerErrorResponse
} from '../utils/ObjectResponse';

export const getMessagesController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const messages = await getMessageService(
      {
        channelId: req.params.channelId
      },
      Number(req?.query?.page) || 1,
      Number(req.query.limit) || 60
    );
    return res.status(StatusCodes.OK).json(messages);
  } catch (error: any) {
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
