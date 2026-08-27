import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { AuthRequest } from '../types/custom.js';
import {
  acceptInvitationService,
  createInvitationService,
  getInvitationByTokenService
} from '../services/invitationService.js';
import {
  customErrorResponse,
  internalServerErrorResponse,
  successResponse
} from '../utils/ObjectResponse.js';

export const createInvitationController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { workspaceId } = req.body;
    const invitation = await createInvitationService(
      new mongoose.Types.ObjectId(workspaceId),
      req.user!
    );
    res.status(StatusCodes.CREATED).json(
      successResponse(invitation, 'Invitation created successfully')
    );
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json(customErrorResponse(error.message));
      return;
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrorResponse(error));
  }
};

export const getInvitationByTokenController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { token } = req.params;
    const response = await getInvitationByTokenService(token);
    res.status(StatusCodes.OK).json(
      successResponse(response, 'Invitation fetched successfully')
    );
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json(customErrorResponse(error.message));
      return;
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrorResponse(error));
  }
};

export const acceptInvitationController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { token } = req.params;
    const response = await acceptInvitationService(token, req.user!);
    res.status(StatusCodes.OK).json(
      successResponse(response, 'Successfully joined workspace')
    );
  } catch (error: any) {
    if (error.statusCode) {
      res.status(error.statusCode).json(customErrorResponse(error.message));
      return;
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrorResponse(error));
  }
};
