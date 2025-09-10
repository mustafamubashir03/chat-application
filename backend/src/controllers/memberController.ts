import mongoose from 'mongoose';
import { isMemberPartOfWorkspaceService } from '../services/memberService';
import { AuthRequest } from '../types/custom';
import { StatusCodes } from 'http-status-codes';
import {
  customErrorResponse,
  internalServerErrorResponse
} from '../utils/ObjectResponse';
import { Response } from 'express';

export const isMemberPartOfWorkspaceController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const Member = await isMemberPartOfWorkspaceService(
      new mongoose.Types.ObjectId(req.params.workspaceId),
      req.user!
    );
    res.status(StatusCodes.OK).json(Member);
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
