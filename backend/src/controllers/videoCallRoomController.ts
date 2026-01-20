import { Server, Socket } from 'socket.io'

interface JoinParams {
  roomId: string
  peerId: string
}

/**
 * roomId -> peerIds[]
 */
const rooms: Record<string, string[]> = {}

export const videoCallRoomHandler = (io: Server, socket: Socket) => {
  console.log('📹 Video call handler attached:', socket.id)

  let currentRoomId: string | null = null
  let currentPeerId: string | null = null

  // ================================
  // JOIN VIDEO CALL
  // ================================
  socket.on(
    'joinVideoCall',
    (data: JoinParams, cb?: (res: any) => void) => {
      const roomId = String(data?.roomId)
      const peerId = String(data?.peerId)

      if (!roomId || !peerId) {
        cb?.({ success: false, message: 'Invalid payload' })
        return
      }

      currentRoomId = roomId
      currentPeerId = peerId

      if (!rooms[roomId]) {
        rooms[roomId] = []
      }

      /**
       * IMPORTANT:
       * Remove any old peer from same user (refresh / reconnect case)
       * peerId format: userId-random
       */
      const userId = peerId.split('-')[0]
      rooms[roomId] = rooms[roomId].filter(
        (p) => !p.startsWith(`${userId}-`)
      )

      // Add current peer
      rooms[roomId].push(peerId)

      socket.join(roomId)

      console.log(
        `✅ Peer ${peerId} joined room ${roomId}`,
        rooms[roomId]
      )

      // 1️⃣ Notify OTHERS that a new peer joined
      socket.to(roomId).emit('user-joined', { peerId })

      // 2️⃣ Emit updated participants list (slight delay avoids race)
      setTimeout(() => {
        io.to(roomId).emit('get-users', {
          roomId,
          participants: rooms[roomId],
        })
      }, 50)

      // 3️⃣ Ack to joining client
      cb?.({
        success: true,
        message: 'Successfully joined the video room',
        data: {
          roomId,
          peerId,
          participants: rooms[roomId],
        },
      })
    }
  )

  // ================================
  // DISCONNECT (ONLY ONCE)
  // ================================
  socket.on('disconnect', () => {
    if (!currentRoomId || !currentPeerId) return

    console.log(
      `❌ Peer ${currentPeerId} disconnected from room ${currentRoomId}`
    )

    rooms[currentRoomId] =
      rooms[currentRoomId]?.filter((p) => p !== currentPeerId) ?? []

    // Notify remaining users
    socket.to(currentRoomId).emit('user-left', {
      peerId: currentPeerId,
    })

    io.to(currentRoomId).emit('get-users', {
      roomId: currentRoomId,
      participants: rooms[currentRoomId],
    })

    // Cleanup empty room
    if (rooms[currentRoomId].length === 0) {
      delete rooms[currentRoomId]
    }

    currentRoomId = null
    currentPeerId = null
  })
}
