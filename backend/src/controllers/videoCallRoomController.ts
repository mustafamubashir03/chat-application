import { Server, Socket } from 'socket.io';
import { JOIN_VIDEO_CALL, GET_USERS, USER_JOINED } from '../utils/eventConstant.js';

interface JoinParams {
  roomId: string;
  peerId: string;
}

const rooms: Record<string, string[]> = {};


export const videoCallRoomHandler = (io: Server, socket: Socket) => {
  console.log('VIDEO CALL HANDLER ATTACHED');

  socket.on(JOIN_VIDEO_CALL, (data: JoinParams, cb) => {
    console.log("📞 JOIN_VIDEO_CALL event received!", data);
    const roomId = String(data.roomId);
    const peerId = String(data.peerId);

    if (!roomId || !peerId) {
      return cb?.({ success: false, message: 'Invalid payload' });
    }
    console.log("rooms",rooms)

    if (!rooms[roomId]) rooms[roomId] = [];

    if (!rooms[roomId].includes(peerId)) {
      rooms[roomId].push(peerId);
    }

    socket.join(roomId);
    socket.on('ready',()=>{
       socket.to(roomId).emit(USER_JOINED,{peerId})
    })

    console.log(
      `${socket.id} joined room ${roomId} with peer ${peerId}`
    );

    // emit room state to everyone IN THE ROOM
    io.to(roomId).emit(GET_USERS, {
      roomId, 
      participants: rooms[roomId],
    });

    cb?.({
      success: true,
      message: 'Successfully joined the video room',
      data: {
        roomId,
        peerId,
        participants: rooms[roomId],
      },
    });

    // cleanup on disconnect
    socket.on('disconnect', () => {
      rooms[roomId] = rooms[roomId]?.filter(p => p !== peerId);
      io.to(roomId).emit(GET_USERS, {
        roomId,
        participants: rooms[roomId],
      });
      console.log(`${peerId} left room ${roomId}`);
    });
  });
};
