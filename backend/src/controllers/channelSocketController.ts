import { Server, Socket } from 'socket.io';

import { JOIN_CHANNEL } from '../utils/eventConstant';

type JoinChannelData = {
  channelId: string;
};

type JoinChannelResponse = {
  success: boolean;
  message: string;
  data: string;
};

export default function channelSocketHandlers(io: Server, socket: Socket) {
  socket.on(
    JOIN_CHANNEL,
    async function joinChannelHandler(
      data: JoinChannelData,
      cb?: (response: JoinChannelResponse) => void
    ) {
      const roomId = String(data.channelId);
      console.log(`${socket.id} has joined channel: ${roomId}`);
      socket.join(roomId);
      cb?.({
        success: true,
        message: 'Successfully joined the channel',
        data: roomId
      });
    }
  );
}
