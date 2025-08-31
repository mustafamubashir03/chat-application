import { Response } from 'express';
import { AuthRequest } from '../types/custom';
import {
  getChannelByIdService,
  getChannelWithWorkspaceDetailsService
} from '../services/channelService';
import mongoose from 'mongoose';
import {
  customErrorResponse,
  internalServerErrorResponse
} from '../utils/ObjectResponse';
import { StatusCodes } from 'http-status-codes';

export const getChannelByIdController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const channel = await getChannelByIdService(
      new mongoose.Types.ObjectId(req.params.channelId)
    );
    res.status(StatusCodes.OK).json(channel);
  } catch (error: any) {
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

export const getChannelWithWorkspaceDetailsController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const channel = await getChannelWithWorkspaceDetailsService(
      new mongoose.Types.ObjectId(req.params.channelId),
      req.user!
    );
    res.status(StatusCodes.OK).json(channel);
  } catch (error: any) {
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
