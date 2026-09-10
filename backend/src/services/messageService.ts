import { Document } from 'mongoose';
import mongoose from 'mongoose';

import messageRepository from '../repository/messageRepository.js';
import channelRepository from '../repository/channelRepository.js';
import { isUserPartOfWorkspace } from './workspaceService.js';
import { StatusCodes } from 'http-status-codes';
import { ClientError } from '../utils/ObjectResponse.js';
import { MessageI } from '../schema/message.js';

export type CreateMessageInput = Omit<MessageI, keyof Document>;
type MessageQueryParams = {
  channelId?: string | import('mongoose').Types.ObjectId;
  workspaceId?: string | import('mongoose').Types.ObjectId;
  senderId?: string | import('mongoose').Types.ObjectId;
};

// DM rooms are two sorted ObjectId-hex strings joined with "_".
const DM_ROOM_ID_PATTERN = /^[0-9a-fA-F]{24}_[0-9a-fA-F]{24}$/;

export const getMessageService = async (
  messageParams: MessageQueryParams,
  page: number,
  limit: number
) => {
  const messages = await messageRepository.getPaginatedMessages(
    messageParams,
    page,
    limit
  );
  return messages;
};

/**
 * Returns a page of messages for a channel or DM room only if the requesting
 * user is a participant. Channels require workspace membership; DM rooms
 * require the requesting user to be one of the two room participants.
 */
export const getMessagesForUserService = async (
  channelId: string,
  userId: string | mongoose.Types.ObjectId,
  page: number,
  limit: number
) => {
  const requesterId = String(userId);

  if (DM_ROOM_ID_PATTERN.test(channelId)) {
    const [first, second] = channelId.split('_');
    if (requesterId !== first && requesterId !== second) {
      throw new ClientError({
        message: 'Invalid data from client',
        explanation: 'You are not part of this conversation',
        status: StatusCodes.UNAUTHORIZED
      });
    }
  } else if (mongoose.Types.ObjectId.isValid(channelId)) {
    const channel = await channelRepository.getChannelWithWorkspaceDetails(
      new mongoose.Types.ObjectId(channelId)
    );
    if (!channel) {
      throw new ClientError({
        message: 'Invalid data from client',
        explanation: 'No such channel exists',
        status: StatusCodes.NOT_FOUND
      });
    }
    const validUser = isUserPartOfWorkspace(
      new mongoose.Types.ObjectId(requesterId),
      channel.workspaceId
    );
    if (!validUser) {
      throw new ClientError({
        message: 'Invalid data from client',
        explanation: 'You are not part of this workspace',
        status: StatusCodes.UNAUTHORIZED
      });
    }
  } else {
    throw new ClientError({
      message: 'Invalid data from client',
      explanation: 'Invalid channel id',
      status: StatusCodes.BAD_REQUEST
    });
  }

  return messageRepository.getPaginatedMessages(
    { channelId },
    page,
    limit
  );
};

export const createMessageService = async (message: CreateMessageInput) => {
  const newMessage = await messageRepository.createDoc(message);
  return newMessage;
};

export const getUnsignedImageURLS = () => {};
