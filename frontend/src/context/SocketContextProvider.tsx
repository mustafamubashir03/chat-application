import { createContext, useEffect, useReducer, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import Peer from 'peerjs'
import { useAuth } from '@/hooks/context/useAuth'
import { peerReducer } from '@/Reducers/peerReducer'
import { addPeerAction, removePeerAction } from '@/Actions/peerAction'

type PeerMap = Record<string, { stream: MediaStream }>
export interface SocketMessage {
  _id: string
  channelId: string
  messageBody: string
  image?: string
  createdAt: string
  senderId?: {
    _id: string
    username: string
    avatar?: string
  }
}

type JoinVideoAck = {
  success: boolean
  message: string
  data?: {
    roomId: string
    peerId: string
    participants: string[]
  }
}

type SocketContextType = {
  socket: Socket | null
  joinChannel: (channelId: string) => void
  leaveChannel: (channelId: string) => void
  currentChannel: string
  newMessageRecieved: SocketMessage | null
  joinVideoCall: (roomId: string) => void
  peer: Peer | null
  peerReady: boolean
  stream: MediaStream | null
  peers: PeerMap
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  joinChannel: () => {},
  leaveChannel: () => {},
  currentChannel: '',
  newMessageRecieved: null,
  joinVideoCall: () => {},
  peer: null,
  peerReady: false,
  stream: null,
  peers: {},
})

export const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { auth } = useAuth()

  const socketRef = useRef<Socket | null>(null)

  const [socket, setSocket] = useState<Socket | null>(null)
  const [peer, setPeer] = useState<Peer | null>(null)
  const [peerReady, setPeerReady] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [peers, dispatch] = useReducer(peerReducer, {})
  const [currentChannel, setCurrentChannel] = useState('')
  const [newMessageRecieved, setNewMessageRecieved] = useState<SocketMessage | null>(null)

  /* =======================
     LOCAL MEDIA
  ======================= */
  const getLocalStream = async (): Promise<MediaStream | null> => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      setStream(s)
      return s
    } catch (err) {
      console.error('getUserMedia failed', err)
      return null
    }
  }

  /* =======================
     INIT SOCKET + PEER
  ======================= */
  useEffect(() => {
    if (!auth?.user) return

    const p = new Peer(`${auth.user.id}-${Date.now()}`)
    setPeer(p)

    const s = io(import.meta.env.VITE_BACKEND_SOCKET_URL, {
      auth: { token: auth.token },
    })

    socketRef.current = s
    setSocket(s)

    s.on('connect', () => console.log('🟢 socket connected', s.id))
    s.on('newMessageRecieved', setNewMessageRecieved)

    s.on('user-left', ({ peerId }: { peerId: string }) => {
      dispatch(removePeerAction(peerId))
    })

    p.on('open', async () => {
      const local = await getLocalStream()
      if (local) setPeerReady(true)
    })

    p.on('error', err => console.error('PeerJS error', err))

    return () => {
      s.disconnect()
      p.destroy()
      stream?.getTracks().forEach(t => t.stop())
    }
  }, [auth?.user])

  /* =======================
     ANSWER CALLS
  ======================= */
  useEffect(() => {
    if (!peer || !stream) return

    peer.on('call', call => {
      call.answer(stream)

      call.on('stream', remoteStream => {
        dispatch(addPeerAction(call.peer, remoteStream))
      })
    })

    return () => {
      peer.removeAllListeners('call')
    }
  }, [peer, stream])

  /* =======================
     SOCKET EVENTS
  ======================= */
  useEffect(() => {
    if (!socket || !peer || !stream) return

    // Existing users already in room
    socket.on('get-users', ({ participants }: { participants: string[] }) => {
      if (!Array.isArray(participants)) return

      participants.forEach(remotePeerId => {
        if (remotePeerId === peer.id) return
        if (peers[remotePeerId]) return

        const call = peer.call(remotePeerId, stream)
        call.on('stream', remoteStream => {
          dispatch(addPeerAction(remotePeerId, remoteStream))
        })
      })
    })

    // New user joined AFTER you
    socket.on('user-joined', ({ peerId }: { peerId: string }) => {
      if (peerId === peer.id) return
      if (peers[peerId]) return

      const call = peer.call(peerId, stream)
      call.on('stream', remoteStream => {
        dispatch(addPeerAction(peerId, remoteStream))
      })
    })

    return () => {
      socket.off('get-users')
      socket.off('user-joined')
    }
  }, [socket, peer, stream, peers])

  /* =======================
     CHANNELS
  ======================= */
  const joinChannel = (channelId: string) => {
    socketRef.current?.emit(
      'joinChannel',
      { channelId },
      (res: { success: boolean; data: string }) => {
        if (res.success) setCurrentChannel(res.data)
      }
    )
  }

  const leaveChannel = (channelId: string) => {
    socketRef.current?.emit('leaveChannel', { channelId })
    setCurrentChannel('')
  }

  /* =======================
     JOIN VIDEO ROOM
  ======================= */
  const joinVideoCall = (roomId: string) => {
    if (!socket || !peer || !peerReady) return

    socket.emit(
      'joinVideoCall',
      { roomId, peerId: peer.id },
      (ack: JoinVideoAck) => {
        if (!ack?.data?.participants) return

        ack.data.participants.forEach(remotePeerId => {
          if (remotePeerId === peer.id) return
          if (peers[remotePeerId]) return

          const call = peer.call(remotePeerId, stream!)
          call.on('stream', remoteStream => {
            dispatch(addPeerAction(remotePeerId, remoteStream))
          })
        })
      }
    )
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        joinChannel,
        leaveChannel,
        currentChannel,
        newMessageRecieved,
        joinVideoCall,
        peer,
        peerReady,
        stream,
        peers,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}
