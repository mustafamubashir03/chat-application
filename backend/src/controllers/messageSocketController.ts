import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';

import {
  CreateMessageInput,
  createMessageService
} from '../services/messageService.js';
import {
  NEW_MESSAGE_EVENT,
  NEW_MESSAGE_RECIEVED_EVENT
} from '../utils/eventConstant.js';
import Message from '../schema/message.js';

type MessageResponse = {
  success: boolean;
  message: string;
  data: unknown;
};

export default async function messageHandlers(io: Server, socket: Socket) {
  socket.on(
    NEW_MESSAGE_EVENT,
    async function createMessageHandler(
      data: CreateMessageInput,
      cb?: (response: MessageResponse) => void
    ) {
      try {
        const senderId = String(data?.senderId ?? '');
        if (!mongoose.Types.ObjectId.isValid(senderId)) {
          cb?.({
            success: false,
            message: 'Invalid sender id',
            data: null
          });
          return;
        }

        const messageResponse = await createMessageService(data);
        const message = await Message.findById(messageResponse._id).populate(
          'senderId',
          'username email avatar'
        );
        const channelId = String(data.channelId);
        io.to(channelId).emit(NEW_MESSAGE_RECIEVED_EVENT, message);
        //Implementation of rooms
        cb?.({
          success: true,
          message: 'Successfully created the message',
          data: messageResponse
        });
      } catch (error: any) {
        cb?.({
          success: false,
          message: error?.message || 'Failed to create the message',
          data: null
        });
      }
    }
  );
}
