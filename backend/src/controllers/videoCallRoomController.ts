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
// Track which socket currently owns a peerId inside a room (for idempotent leave)
const peerSocketOwners: Record<string, Record<string, string>> = {};

const meetingTimers: Record<string, NodeJS.Timeout> = {};

// Emit shallow-cloned meeting objects so React state updates don't bail out
// on identical object references.
const serializeMeeting = (meeting: ActiveMeeting) => ({
  ...meeting,
  participants: { ...meeting.participants }
});

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

export const getActiveMeetingByWorkspaceId = (
  workspaceId: string
): ActiveMeeting | null => activeMeetings[workspaceId] || null;

export const videoCallRoomHandler = (io: Server, socket: Socket) => {
  // Join workspace channel for state sync
  socket.on('workspace:join', ({ workspaceId }: { workspaceId: string }) => {
    if (!workspaceId) return;
    const wsRoom = `workspace:${workspaceId}`;
    socket.join(wsRoom);
    // Send current active meeting state if any
    const meeting = activeMeetings[workspaceId] || null;
    socket.emit('workspace:meeting-status', {
      workspaceId,
      meeting: meeting ? serializeMeeting(meeting) : null
    });
  });

  socket.on('workspace:get-meeting-status', ({ workspaceId }: { workspaceId: string }, cb?: any) => {
    const meeting = activeMeetings[workspaceId] || null;
    if (cb) cb(meeting ? serializeMeeting(meeting) : null);
    else
      socket.emit('workspace:meeting-status', {
        workspaceId,
        meeting: meeting ? serializeMeeting(meeting) : null
      });
  });

  const createRoom = (data: JoinParams, cb?: any) => {
    const roomId = String(data.roomId);
    const peerId = String(data.peerId);

    if (!rooms[roomId]) {
      rooms[roomId] = new Set();
    }
    rooms[roomId].add(peerId);
    if (!peerSocketOwners[roomId]) peerSocketOwners[roomId] = {};
    peerSocketOwners[roomId][peerId] = socket.id;

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

    io.to(`workspace:${roomId}`).emit('workspace:meeting-started', serializeMeeting(meeting));
    socket.emit('room-created', roomId, Array.from(rooms[roomId]));

    cb?.({
      success: true,
      message: 'Room created',
      data: roomId,
      meeting: serializeMeeting(meeting)
    });
  };

  const joinedRoom = (data: JoinParams, cb?: any) => {
    const roomId = String(data.roomId);
    const peerId = String(data.peerId);

    socket.join(roomId);
    socket.join(`workspace:${roomId}`);
    socket.data.roomId = roomId;
    socket.data.peerId = peerId;

    const meeting = activeMeetings[roomId];

    // No active meeting — do NOT implicitly create one (separates "join" from "start")
    if (!meeting) {
      cb?.({
        success: true,
        participants: [],
        meeting: null
      });
      return;
    }

    // Someone re-joined within the grace period — cancel the end timer
    if (meetingTimers[roomId]) {
      clearTimeout(meetingTimers[roomId]);
      delete meetingTimers[roomId];
    }

    if (!rooms[roomId]) {
      rooms[roomId] = new Set();
    }
    rooms[roomId].add(peerId);
    if (!peerSocketOwners[roomId]) peerSocketOwners[roomId] = {};
    peerSocketOwners[roomId][peerId] = socket.id;

    meeting.participants[peerId] = {
      peerId,
      userId: data.user?.id,
      username: data.user?.username,
      micOn: true,
      cameraOn: true
    };

    // Send existing peers list to joiner
    socket.emit(GET_USERS, {
      roomId,
      participants: Array.from(rooms[roomId]),
      meeting: serializeMeeting(meeting)
    });

    // Notify workspace of updated meeting state
    io.to(`workspace:${roomId}`).emit('workspace:meeting-updated', serializeMeeting(meeting));

    cb?.({
      success: true,
      participants: Array.from(rooms[roomId]),
      meeting: serializeMeeting(meeting)
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
    if (!roomId || !peerId || !rooms[roomId]) return;

    // Only the socket that currently owns this peerId may remove it.
    // This makes leave idempotent and resolves the reconnect race where an old
    // socket's disconnect arrives after the same user rejoined on a new socket.
    const ownerId = peerSocketOwners[roomId]?.[peerId];
    if (ownerId !== socket.id) return;

    delete peerSocketOwners[roomId][peerId];

    rooms[roomId].delete(peerId);
    if (activeMeetings[roomId]?.participants[peerId]) {
      delete activeMeetings[roomId].participants[peerId];
    }

    socket.to(roomId).emit('user-left', { peerId });

    if (rooms[roomId].size === 0) {
      delete rooms[roomId];
      delete peerSocketOwners[roomId];
      if (meetingTimers[roomId]) clearTimeout(meetingTimers[roomId]);
      meetingTimers[roomId] = setTimeout(() => {
        if (!rooms[roomId] || rooms[roomId].size === 0) {
          delete activeMeetings[roomId];
          delete meetingTimers[roomId];
          io.to(`workspace:${roomId}`).emit('workspace:meeting-ended', { workspaceId: roomId });
        }
      }, 30000); // 30 second grace period for refresh/network reconnect
    } else if (activeMeetings[roomId]) {
      io.to(`workspace:${roomId}`).emit('workspace:meeting-updated', serializeMeeting(activeMeetings[roomId]));
    }
  };

  socket.on('leave-room', handleLeave);
  socket.on('disconnect', handleLeave);
};
