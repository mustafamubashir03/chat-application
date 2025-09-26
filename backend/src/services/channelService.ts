import { StatusCodes } from 'http-status-codes';
import channelRepository from '../repository/channelRepository';
import { ClientError } from '../utils/ObjectResponse';
import mongoose from 'mongoose';
import { isUserPartOfWorkspace } from './workspaceService';
import messageRepository from '../repository/messageRepository';


export const getChannelByIdService = async (
  channelId: mongoose.Types.ObjectId
) => {
  try {
    const channel = await channelRepository.getDocById(channelId);
    if (!channel) {
      throw new ClientError({
        message: 'Invalid data from client',
        explanation: 'No such workspace exists',
        status: StatusCodes.NOT_FOUND
      });
    }

    return channel;
  } catch (error) {
    throw error;
  }
};
export const getChannelWithWorkspaceDetailsService = async (
  channelId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
) => {
  try {
    const channel =
      await channelRepository.getChannelWithWorkspaceDetails(channelId);
    if (!channel) {
      throw new ClientError({
        message: 'Invalid data from client',
        explanation: 'No such workspace exists',
        status: StatusCodes.NOT_FOUND
      });
    }

    const validUser = isUserPartOfWorkspace(userId, channel.workspaceId);
    if (!validUser) {
      throw new ClientError({
        message: 'Invalid data from client',
        explanation: 'You are not part of this workspace',
        status: StatusCodes.UNAUTHORIZED
      });
    }

    const messages = await messageRepository.getPaginatedMessages(
      { channelId },
      1,
      20
    )

    // Convert Mongoose document to plain object and add messages
    const channelData = channel.toObject();
    return {
      ...channelData,
      messages
    };
  } catch (error) {
    throw error;
  }
};
