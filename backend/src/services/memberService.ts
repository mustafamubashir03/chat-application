import mongoose from 'mongoose';
import { isUserPartOfWorkspace } from './workspaceService.js';
import workspaceRepository from '../repository/workspaceRespository.js';
import { StatusCodes } from 'http-status-codes';
import { ClientError } from '../utils/ObjectResponse.js';
import userRepository from '../repository/userRepository.js';

export const isMemberPartOfWorkspaceService = async (
  workspaceId: mongoose.Types.ObjectId,
  memberId: mongoose.Types.ObjectId
) => {
  const workspace = await workspaceRepository.getDocById(workspaceId);
  if (!workspace) {
    throw new ClientError({
      message: 'Invalid data from client',
      explanation: 'No such workspace exists',
      status: StatusCodes.NOT_FOUND
    });
  }
  const isMemberPartOfWorkspace = isUserPartOfWorkspace(memberId, workspace);
  if (!isMemberPartOfWorkspace) {
    throw new ClientError({
      message: 'Invalid data from client',
      explanation: 'Member is not part of workspace',
      status: StatusCodes.NOT_FOUND
    });
  }
  const user = await userRepository.getDocById(memberId);
  return user;
};
