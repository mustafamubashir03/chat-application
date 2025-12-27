import workspaceRepository from '../repository/workspaceRespository';
import { v4 as uuidv4 } from 'uuid';
import { ClientError } from '../utils/ObjectResponse';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import channelRepository from '../repository/channelRepository';
import { UpdateWorkspaceType } from '@itz____mmm/common';
import { addEmailtoMailQueue } from '../producers/mailQueueProducer';
import mailObject from '../utils/mailObject';
import userRepository from '../repository/userRepository';

export const isUserAdminOfWorkspace = (
  userId: mongoose.Types.ObjectId,
  workspace: any
) => {
  return workspace.members.find(
    (member: { memberId: mongoose.Types.ObjectId | any; role: string }) => {
      // Handle both populated and unpopulated memberId
      const memberId = member.memberId?._id || member.memberId;
      return (
        memberId?.toString() === userId.toString() && member.role === 'admin'
      );
    }
  );
};
export const isUserPartOfWorkspace = (
  userId: mongoose.Types.ObjectId,
  workspace: any
) => {
  return workspace?.members?.find(
    (member: { memberId: mongoose.Types.ObjectId | any; role: string }) => {
      // Handle both populated and unpopulated memberId
      const memberId = member.memberId?._id || member.memberId;
      return memberId?.toString() === userId.toString();
    }
  );
};

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
    const isAllowed = isUserAdminOfWorkspace(userId, workspace);
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

export const getWorkspaceByIdService = async (
  workspaceId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
) => {
  try {
    const workspace =
      await workspaceRepository.getWorkspaceWithChannelDetails(workspaceId);
    if (!workspace) {
      throw new ClientError({
        message: 'Invalid data from client',
        explanation: 'No such workspace exists',
        status: StatusCodes.NOT_FOUND
      });
    }
    const isMember = isUserPartOfWorkspace(userId, workspace);
    if (!isMember) {
      throw new ClientError({
        message: 'User is not part of the workspace',
        explanation: 'Workspace is not found or user is not part of workspace',
        status: StatusCodes.UNAUTHORIZED
      });
    }
    return workspace;
  } catch (error) {
    throw error;
  }
};

export const getWorkspaceByJoinCodeService = async (joinCode: string) => {
  try {
    const workspace = await workspaceRepository.getWokspaceByJoinCode(joinCode);
    return workspace;
  } catch (error) {
    throw error;
  }
};

export const updateWorkspaceService = async (
  workspaceId: mongoose.Types.ObjectId,
  workspaceData: UpdateWorkspaceType,
  userId: mongoose.Types.ObjectId
) => {
  try {
    const workspace = await workspaceRepository.getDocById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        message: 'Invalid data from client',
        explanation: 'No such workspace exists',
        status: StatusCodes.NOT_FOUND
      });
    }
    const isAllowed = isUserAdminOfWorkspace(userId, workspace);
    if (isAllowed) {
      const updatedWorkspace = await workspaceRepository.updateDoc(
        workspaceId,
        { name: workspaceData.name }
      );
      return updatedWorkspace;
    } else {
      throw new ClientError({
        message: 'User is not authorized to update the workspace',
        explanation: 'Workspace is not found or user is not an admin',
        status: StatusCodes.UNAUTHORIZED
      });
    }
  } catch (error) {
    throw error;
  }
};

export const addMemberToWorkspaceService = async (
  memberId: mongoose.Types.ObjectId,
  workspaceId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  role: string
) => {
  try {
    const workspace = await workspaceRepository.getDocById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        message: 'Invalid data from client',
        explanation: 'No such workspace exists',
        status: StatusCodes.NOT_FOUND
      });
    }
    const isValidUser = await userRepository.getDocById(memberId);
    if (!isValidUser) {
      throw new ClientError({
        message: 'User is not valid',
        explanation: 'No such user exist',
        status: StatusCodes.NOT_FOUND
      });
    }
    const isAllowed = isUserAdminOfWorkspace(userId, workspace);
    if (!isAllowed) {
      throw new ClientError({
        message: 'User is not authorized to add member to the workspace',
        explanation: 'Workspace is not found or user is not an admin',
        status: StatusCodes.UNAUTHORIZED
      });
    }

    const response = await workspaceRepository.addMemberToWorkspace(
      memberId,
      workspaceId,
      role
    );
    await addEmailtoMailQueue({
      ...mailObject,
      to: isValidUser.email,
      subject: 'You have been added to a Workspace',
      text: `Someone has added you to the workspace ${workspace.name}.`
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const addChannelToWorkspaceService = async (
  channelName: string,
  userId: mongoose.Types.ObjectId,
  workspaceId: mongoose.Types.ObjectId
) => {
  try {
    const workspace = await workspaceRepository.getDocById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        message: 'Invalid data from client',
        explanation: 'No such workspace exists',
        status: StatusCodes.NOT_FOUND
      });
    }
    const isAllowed = isUserAdminOfWorkspace(userId, workspace);
    if (!isAllowed) {
      throw new ClientError({
        message: 'User is not authorized to add channel to the workspace',
        explanation: 'Workspace is not found or user is not an admin',
        status: StatusCodes.UNAUTHORIZED
      });
    }
    const response = await workspaceRepository.addChannelToWorkspace(
      workspaceId,
      channelName
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const resetWorkspaceJoinCodeService = async (
  workspaceId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
) => {
  try {
    const newJoinCode = uuidv4().substring(0, 6).toUpperCase();
    const updatedWorkspace = await updateWorkspaceService(
      workspaceId,
      { joinCode: newJoinCode },
      userId
    );
    return updatedWorkspace;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const joinWorkspaceService = async (
  workspaceId: mongoose.Types.ObjectId,
  joinCode: string,
  memberId: mongoose.Types.ObjectId,
  role: string
) => {
  try {
    const workspace = await workspaceRepository.getDocById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        message: 'Invalid data from client',
        explanation: 'No such workspace exists',
        status: StatusCodes.NOT_FOUND
      });
    }
    const isValidUser = await userRepository.getDocById(memberId);
    if (!isValidUser) {
      throw new ClientError({
        message: 'User is not valid',
        explanation: 'No such user exist',
        status: StatusCodes.NOT_FOUND
      });
    }

    const response = await workspaceRepository.addMemberToWorkspace(
      memberId,
      workspaceId,
      role
    );
    return response;
  } catch (error) {
    throw error;
  }
};
