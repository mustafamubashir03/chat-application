import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { GET_USERS, USER_JOINED } from '../utils/eventConstant.js';

interface JoinParams {
  roomId: string; // workspaceId
  peerId: string;
  user?: {
    id: string;
    username: string;
  };
}

interface ParticipantInfo {
  userId?: string;
  username?: string;
  peerId: string;
  micOn?: boolean;
  cameraOn?: boolean;
}

interface ActiveMeeting {
  meetingId: string;
  workspaceId: string;
  startedBy: {
    userId: string;
    username: string;
  };
  createdAt: Date;
  participants: Record<string, ParticipantInfo>;
}

// Global active meetings store (workspaceId -> ActiveMeeting)
const activeMeetings: Record<string, ActiveMeeting> = {};
// Room peer sets (workspaceId -> Set of peerIds)
const rooms: Record<string, Set<string>> = {};

const meetingTimers: Record<string, NodeJS.Timeout> = {};

export const getOrCreateMeeting = (
  workspaceId: string,
  user?: { id: string; username: string }
): ActiveMeeting => {
  if (meetingTimers[workspaceId]) {
    clearTimeout(meetingTimers[workspaceId]);
    delete meetingTimers[workspaceId];
  }
  if (!activeMeetings[workspaceId]) {
    activeMeetings[workspaceId] = {
      meetingId: uuidv4(),
      workspaceId,
      startedBy: {
        userId: user?.id || 'unknown',
        username: user?.username || 'Member'
      },
      createdAt: new Date(),
      participants: {}
    };
  }
  return activeMeetings[workspaceId];
};

export const videoCallRoomHandler = (io: Server, socket: Socket) => {
  // Join workspace channel for state sync
  socket.on('workspace:join', ({ workspaceId }: { workspaceId: string }) => {
    if (!workspaceId) return;
    const wsRoom = `workspace:${workspaceId}`;
    socket.join(wsRoom);
    // Send current active meeting state if any
    const meeting = activeMeetings[workspaceId] || null;
    socket.emit('workspace:meeting-status', { workspaceId, meeting });
  });

  socket.on('workspace:get-meeting-status', ({ workspaceId }: { workspaceId: string }, cb?: any) => {
    const meeting = activeMeetings[workspaceId] || null;
    if (cb) cb(meeting);
    else socket.emit('workspace:meeting-status', { workspaceId, meeting });
  });

  const createRoom = (data: JoinParams, cb?: any) => {
    const roomId = String(data.roomId);
    const peerId = String(data.peerId);

    if (!rooms[roomId]) {
      rooms[roomId] = new Set();
    }
    rooms[roomId].add(peerId);

    const meeting = getOrCreateMeeting(roomId, data.user);
    meeting.participants[peerId] = {
      peerId,
      userId: data.user?.id,
      username: data.user?.username,
      micOn: true,
      cameraOn: true
    };

    socket.join(roomId);
    socket.join(`workspace:${roomId}`);
    socket.data.roomId = roomId;
    socket.data.peerId = peerId;

    io.to(`workspace:${roomId}`).emit('workspace:meeting-started', meeting);
    socket.emit('room-created', roomId, Array.from(rooms[roomId]));

    cb?.({
      success: true,
      message: 'Room created',
      data: roomId,
      meeting
    });
  };

  const joinedRoom = (data: JoinParams, cb?: any) => {
    const roomId = String(data.roomId);
    const peerId = String(data.peerId);

    if (!rooms[roomId]) {
      rooms[roomId] = new Set();
    }
    rooms[roomId].add(peerId);

    const meeting = getOrCreateMeeting(roomId, data.user);
    meeting.participants[peerId] = {
      peerId,
      userId: data.user?.id,
      username: data.user?.username,
      micOn: true,
      cameraOn: true
    };

    socket.join(roomId);
    socket.join(`workspace:${roomId}`);
    socket.data.roomId = roomId;
    socket.data.peerId = peerId;

    // Send existing peers list to joiner
    socket.emit(GET_USERS, {
      roomId,
      participants: Array.from(rooms[roomId]),
      meeting
    });

    // Notify workspace of updated meeting state
    io.to(`workspace:${roomId}`).emit('workspace:meeting-updated', meeting);

    cb?.({
      success: true,
      participants: Array.from(rooms[roomId]),
      meeting
    });
  };

  socket.on('create-room', createRoom);
  socket.on('joined-room', joinedRoom);

  socket.on('ready', (data: JoinParams) => {
    const roomId = data.roomId;
    const peerId = data.peerId;
    if (socket.data.roomId !== roomId) return;

    socket.to(roomId).emit(USER_JOINED, {
      peerId,
      user: data.user
    });
  });

  socket.on('toggle-media', (data: { roomId: string; peerId: string; micOn?: boolean; cameraOn?: boolean }) => {
    const { roomId, peerId, micOn, cameraOn } = data;
    if (activeMeetings[roomId]?.participants[peerId]) {
      if (typeof micOn === 'boolean') activeMeetings[roomId].participants[peerId].micOn = micOn;
      if (typeof cameraOn === 'boolean') activeMeetings[roomId].participants[peerId].cameraOn = cameraOn;
      io.to(roomId).emit('participant-media-changed', { peerId, micOn, cameraOn });
    }
  });

  const handleLeave = () => {
    const { roomId, peerId } = socket.data as { roomId?: string; peerId?: string };
    if (!roomId || !peerId) return;

    const room = rooms[roomId];
    if (room) {
      room.delete(peerId);
    }

    if (activeMeetings[roomId]) {
      delete activeMeetings[roomId].participants[peerId];
    }

    socket.to(roomId).emit('user-left', { peerId });

    if (!room || room.size === 0) {
      delete rooms[roomId];
      if (meetingTimers[roomId]) clearTimeout(meetingTimers[roomId]);
      meetingTimers[roomId] = setTimeout(() => {
        if (!rooms[roomId] || rooms[roomId].size === 0) {
          delete activeMeetings[roomId];
          delete meetingTimers[roomId];
          io.to(`workspace:${roomId}`).emit('workspace:meeting-ended', { workspaceId: roomId });
        }
      }, 30000); // 30 second grace period for refresh/network reconnect
    } else if (activeMeetings[roomId]) {
      io.to(`workspace:${roomId}`).emit('workspace:meeting-updated', activeMeetings[roomId]);
    }
  };

  socket.on('leave-room', handleLeave);
  socket.on('disconnect', handleLeave);
};
