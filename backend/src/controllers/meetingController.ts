import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { AuthRequest } from '../types/custom.js';
import {
  createMeetingInvitationService,
  getMeetingInvitationByTokenService
} from '../services/meetingInvitationService.js';
import {
  customErrorResponse,
  internalServerErrorResponse,
  successResponse
} from '../utils/ObjectResponse.js';

export const createMeetingInvitationController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { workspaceId } = req.body;
    const meetingInvite = await createMeetingInvitationService(
      new mongoose.Types.ObjectId(workspaceId),
      req.user!
    );
    res.status(StatusCodes.CREATED).json(
      successResponse(meetingInvite, 'Meeting invitation created successfully')
    );
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json(customErrorResponse(error));
      return;
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrorResponse(error));
  }
};

export const getMeetingInvitationByTokenController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { token } = req.params;
    const response = await getMeetingInvitationByTokenService(token, req.user!);
    res.status(StatusCodes.OK).json(
      successResponse(response, 'Meeting invitation fetched successfully')
    );
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json(customErrorResponse(error));
      return;
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrorResponse(error));
  }
};