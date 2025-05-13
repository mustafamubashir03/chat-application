import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose, { MongooseError } from 'mongoose';
import {
  customErrorResponse,
  internalServerErrorResponse
} from '../utils/ObjectResponse';
import {
  createWorkspaceService,
  deleteWorkspaceService,
  getWorkspaceByIdService,
  getWorkspaceByJoinCodeService,
  getWorkspacesUserIsMemberOfService
} from '../services/workspaceService';
import { AuthRequest } from '../types/custom';

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


export const getWokspaceByJoinCodeController = async(req:AuthRequest,res:Response)=>{
  try{
    const response = getWorkspaceByJoinCodeService(req.params.joinCode)
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

}

export const updateWorkspaceController = async(req:AuthRequest,res:Response)=>{

}
