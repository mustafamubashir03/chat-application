import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose, { MongooseError } from 'mongoose';
import {
  ClientError,
  customErrorResponse,
  internalServerErrorResponse,
  successResponse
} from '../utils/ObjectResponse';
import {
  addChannelToWorkspaceService,
  addMemberToWorkspaceService,
  createWorkspaceService,
  deleteWorkspaceService,
  getWorkspaceByIdService,
  getWorkspaceByJoinCodeService,
  getWorkspacesUserIsMemberOfService,
  joinWorkspaceService,
  resetWorkspaceJoinCodeService,
  updateWorkspaceService
} from '../services/workspaceService';
import { AuthRequest } from '../types/custom';
import { verifyTokenService } from '../services/userService';

export const createWorkspaceController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const response = await createWorkspaceService({
      ...req.body, //name of the workspace
      owner: req.user //userId via middleware valildation
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

export const getWorkspacesUserisMemberOfController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const response = await getWorkspacesUserIsMemberOfService(req.user!);
    res.status(StatusCodes.OK).json(response);
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

export const deleteWorkspaceController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const response = await deleteWorkspaceService(
      new mongoose.Types.ObjectId(req.params.workspaceId),
      req.user!
    );
    res.status(StatusCodes.OK).json(response);
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

export const getWorkspaceByIdController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const response = await getWorkspaceByIdService(
      new mongoose.Types.ObjectId(req.params.workspaceId),
      req.user!
    );
    res.status(StatusCodes.OK).json(response);
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

export const getWokspaceByJoinCodeController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const response = await getWorkspaceByJoinCodeService(req.params.joinCode);
    res.status(StatusCodes.OK).json(response);
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

export const updateWorkspaceController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const response = await updateWorkspaceService(
      new mongoose.Types.ObjectId(req.params.workspaceId),
      req.body,
      req.user!
    );
    res.status(StatusCodes.OK).json(response);
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

export const addMemberToWorkspaceController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const response = await addMemberToWorkspaceService(
      req.body.memberId,
      new mongoose.Types.ObjectId(req.params.workspaceId),
      req.user!,
      req.body.role
    );
    res.status(StatusCodes.OK).json(response);
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
export const joinWorkspaceController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const response = await joinWorkspaceService(
      new mongoose.Types.ObjectId(req.params.workspaceId),
      req.body.joinCode,
      req.user!,
      'member'
    );
    res.status(StatusCodes.OK).json(response);
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

export const addChannelToWorkspaceController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const response = await addChannelToWorkspaceService(
      req.body.channelName,
      req.user!,
      new mongoose.Types.ObjectId(req.params.workspaceId)
    );
    res.status(StatusCodes.OK).json(response);
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

export const resetJoinCodeController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const updatedWorkspace = await resetWorkspaceJoinCodeService(
      new mongoose.Types.ObjectId(req.params.workspaceId),
      req.user!
    );
    res.status(StatusCodes.OK).json(updatedWorkspace);
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

export const verifyEmailController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const response = await verifyTokenService(req.params.token);
    if (!response) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(customErrorResponse({ message: 'Failed to verify email' }));
    }
    res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'Email verified successfully'));
  } catch (error: any) {
    console.log(error);
    // Check for ClientError - it has 'status' property, not 'statusCode'
    if (error instanceof ClientError || error.status) {
      const statusCode =
        error.status || error.statusCode || StatusCodes.BAD_REQUEST;
      return res.status(statusCode).json(customErrorResponse(error));
    }
    if (error.statusCode) {
      return res
        .status(error.statusCode)
        .json(customErrorResponse(error.message));
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerErrorResponse(error));
    return;
  }
};
