import { Server, Socket } from 'socket.io';

import {
  CreateMessageInput,
  createMessageService
} from '../services/messageService';
import {
  NEW_MESSAGE_EVENT,
  NEW_MESSAGE_RECIEVED_EVENT
} from '../utils/eventConstant';
import Message from '../schema/message';

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
      cb: (response: MessageResponse) => void
    ) {
      const messageResponse = await createMessageService(data);
      const message = await Message.findById(messageResponse._id).populate(
        'senderId',
        'username email avatar'
      );
      const channelId = String(data.channelId);
      // socket.broadcast.emit(NEW_MESSAGE_RECIEVED_EVENT,messageResponse)
      io.to(channelId).emit(NEW_MESSAGE_RECIEVED_EVENT, message);
      //Implementation of rooms
      cb?.({
        success: true,
        message: 'Successfully created the message',
        data: messageResponse
      });
    }
  );
}
