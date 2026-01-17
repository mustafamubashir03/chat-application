import { Socket, Server } from 'socket.io';
import { JOIN_VIDEO_CALL } from '../utils/eventConstant.js';

export const videoCallRoomHandler = (io: Server, socket: Socket) => {
  socket.on(JOIN_VIDEO_CALL, function joinVideoCall(data: any, cb: any) {
    const roomId = String(data.workspaceId);
    socket.join(roomId);
    cb?.({
        success: true,
        message: 'Successfully joined the video room',
        data: roomId
    });
    console.log(`${socket.id} has joined channel: ${roomId}`);
});
};
