import { Document } from 'mongoose';

import messageRepository from '../repository/messageRepository';
import { MessageI } from '../schema/message';

export type CreateMessageInput = Omit<MessageI, keyof Document>;
type MessageQueryParams = {
  message: string;
  channelId?: string | import('mongoose').Types.ObjectId;
  workspaceId?: string | import('mongoose').Types.ObjectId;
  senderId?: string | import('mongoose').Types.ObjectId;
};

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

export const createMessageService = async (message: CreateMessageInput) => {
  const newMessage = await messageRepository.createDoc(message);
  return newMessage;
};

export const getUnsignedImageURLS = () => {};
