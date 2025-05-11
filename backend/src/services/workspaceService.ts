import workspaceRepository from '../repository/workspaceRespository';
import { v4 as uuidv4 } from 'uuid';
import { ClientError } from '../utils/ObjectResponse';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import channelRepository from '../repository/channelRepository';

const isUserAdminOfWorkspace = (userId:mongoose.Types.ObjectId,workspace:any)=>{
  return workspace.members.find(
    (member: { memberId: mongoose.Types.ObjectId; role: string }) =>
      (member.memberId.toString() === userId.toString()) && member.role === 'admin'
  );
}
const isUserPartOfWorkspace = (userId:mongoose.Types.ObjectId,workspace:any)=>{
  return workspace.members.find(
    (member: { memberId: mongoose.Types.ObjectId; role: string }) =>
      member.memberId.toString() === userId.toString()
  );
}




export const createWorkspaceService = async (workspaceData: any) => {
  try {
    const joinCode = uuidv4().substring(0, 6).toUpperCase();
    const response = await workspaceRepository.createDoc({
      name: workspaceData.name,
      descripion: workspaceData.descripion,
      joinCode
    });

    await workspaceRepository.addMemberToWorkspace(
      workspaceData.owner,
      response._id,
      'admin'
    );
    const channelAddedWorkspace =
      await workspaceRepository.addChannelToWorkspace(response._id, 'general');
    return channelAddedWorkspace;
  } catch (error) {
    throw new ClientError({
      message: 'Invalid data from client',
      explanation: 'Workspace name already exists',
      status: StatusCodes.FORBIDDEN
    });
  }
};

export const getWorkspacesUserIsMemberOfService = async (
  memberId: mongoose.Types.ObjectId
) => {
  const response =
    await workspaceRepository.fetchAllWorkspacesByMemberId(memberId);
  if (!response) {
    throw new ClientError({
      message: 'Invalid data from client',
      explanation: 'No such member exists in any workspaces',
      status: StatusCodes.NOT_FOUND
    });
  }
  return response;
};

export const deleteWorkspaceService = async (
  workspaceId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
) => {
  try {
    const workspace = await workspaceRepository.getDocById(workspaceId);
    const isAllowed = isUserAdminOfWorkspace(userId,workspace)
    if (isAllowed) {
      await channelRepository.deleteAllDocs(workspace.channels);
      const response = await workspaceRepository.deleteDoc(workspaceId);
      return response;
    } else {
      throw new ClientError({
        message: 'User is not authorized to delete the workspace',
        explanation: 'Workspace is not found or user is not an admin',
        status: StatusCodes.UNAUTHORIZED
      });
    }
  } catch (error) {
    throw error;
  }
};


export const getWorkspaceByIdService = async(workspaceId:mongoose.Types.ObjectId,userId:mongoose.Types.ObjectId)=>{
  try{
   const workspace =  await workspaceRepository.getDocById(workspaceId)
   if (!workspace) {
    throw new ClientError({
      message: 'Invalid data from client',
      explanation: 'No such workspace exists',
      status: StatusCodes.NOT_FOUND
    });

  }
  const isMember = isUserPartOfWorkspace(userId,workspace)
  if (!isMember) {
    throw new ClientError({
      message: 'User is not part of the workspace',
      explanation: 'Workspace is not found or user is not part of workspace',
      status: StatusCodes.UNAUTHORIZED
    });
  }
  return workspace;
}catch (error) {
  throw error;
}}
  