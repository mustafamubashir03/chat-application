import { createContext, useEffect, useReducer, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import Peer from 'peerjs'
import { useAuth } from '@/hooks/context/useAuth'
import { peerReducer } from '@/Reducers/peerReducer'
import { addPeerAction } from '@/Actions/peerAction'
import { fetchParticipantsList } from '@/utils/fetchingFunction'

type SocketContextType = {
  socket: Socket | null
  joinChannel: (channelId: string) => void
  currentChannel: string
  newMessageRecieved: any
  leaveChannel: (channelId: string) => void
  
  // video
  joinVideoCall: (roomId: string) => void
  peer: Peer | null
  stream: MediaStream | null
  setStream: any
  peers: Record<string, { stream: MediaStream }>
  dispatch: any
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  joinChannel: () => {},
  currentChannel: '',
  newMessageRecieved: null,
  leaveChannel: () => {},
  
  joinVideoCall: () => {},
  peer: null,
  stream: null,
  setStream: () => {},
  peers: {},
  dispatch: {},
})

const PEERJS_HOST = import.meta.env.VITE_PEERJS_HOST
const PEERJS_PORT = import.meta.env.VITE_PEERJS_PORT
const PEERJS_PATH = import.meta.env.VITE_PEERJS_PATH

export const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null)
  const peerRef = useRef<Peer | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // ✅ NEW: queue for calls that arrive before stream is ready
  const pendingCallsRef = useRef<any[]>([])

  const [socket, setSocket] = useState<Socket | null>(null)
  const [currentChannel, setCurrentChannel] = useState('')
  const [newMessageRecieved, setNewMessageRecieved] = useState<any>(null)

  // video
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [peer, setPeer] = useState<Peer | null>(null)
  const [peers, dispatch] = useReducer(peerReducer, {})

  const { auth } = useAuth()

  useEffect(() => {
    if (!auth?.user) return

    let active = true
    let localStream: MediaStream | null = null

    // Generate a unique peer id per session. A fixed (user-derived) id collides
    // when the same account connects twice (second tab / reconnect), emitting
    // 'unavailable-id' ("ID is taken"). Signaling only ever passes peer.id
    // around via sockets, so ids don't need to be deterministic.
    const sessionPeerId = `${auth?.user?.id}-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 10)}`
    const newPeer = new Peer(sessionPeerId, {
      host: PEERJS_HOST,
      port: PEERJS_PORT,
      path: PEERJS_PATH,
      secure: true,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      },
    })

    peerRef.current = newPeer
    if (active) setPeer(newPeer)

    // 🔧 MODIFIED (minimal): guard against stream not ready
    newPeer.on('call', (call: any) => {
      console.log('incoming call from', call.peer)

      if (!localStream) {
        console.log('stream not ready, queueing call')
        pendingCallsRef.current.push(call)
        return
      }

      call.answer(localStream)

      call.on('stream', (remoteStream: MediaStream) => {
        dispatch(addPeerAction(call.peer, remoteStream))
      })
    })

    newPeer.on('error', console.error)

    // Create the socket BEFORE requesting camera/mic. Waiting on the media
    // permission prompt left the socket null for a long time, so the first
    // message a user sent was silently dropped/queued.
    // Websocket-only transport avoids the long-polling CORS/429 storms seen on
    // the deployed server (Render proxy returns 503/429 without CORS headers
    // while the backend is cold-starting), which killed live sends including
    // voice notes.
    const newSocket = io(import.meta.env.VITE_BACKEND_SOCKET_URL, {
      path: '/socket.io',
      transports: ['websocket'],
      withCredentials: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 8000,
      timeout: 20000,
    })

    socketRef.current = newSocket
    if (active) setSocket(newSocket)

    newSocket.on('connect', () => console.log('Socket connected:', newSocket.id))
    newSocket.on('newMessageRecieved', setNewMessageRecieved)
    newSocket.on('get-users', fetchParticipantsList)

    // Request camera/mic in parallel — permission being pending must not block
    // the socket or peer from existing.
    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((streamObj) => {
          localStream = streamObj
          streamRef.current = streamObj
          if (active) setStream(streamObj)
        })
        .catch((err) => {
          // Permission denied or no device available — still keep socket + peer
          console.warn('Could not access camera/mic, continuing without local stream', err)
        })
    } catch (err) {
      console.warn('Could not access camera/mic, continuing without local stream', err)
    }

    return () => {
      active = false
      socketRef.current?.disconnect()
      socketRef.current = null
      setSocket(null)
      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = null
      setStream(null)
      peerRef.current?.destroy()
      peerRef.current = null
      setPeer(null)
    }
  }, [auth?.user])

  // ✅ NEW: answer queued calls once stream exists
  useEffect(() => {
    if (!stream) return

    pendingCallsRef.current.forEach((call) => {
      call.answer(stream)

      call.on('stream', (remoteStream: MediaStream) => {
        dispatch(addPeerAction(call.peer, remoteStream))
      })
    })

    pendingCallsRef.current = []
  }, [stream])

  const joinChannel = (channelId: string) => {
    if (!socketRef.current) return
    socketRef.current.emit(
      'joinChannel',
      { channelId },
      (res: { success: boolean; data: string }) => {
        setCurrentChannel(res.data)
      },
    )
  }

  const leaveChannel = (channelId: string) => {
    if (!socketRef.current) return
    socketRef.current.emit('leaveChannel', { channelId })
    setCurrentChannel('')
  }

  const joinVideoCall = (roomId: string) => {
    if (!socket || !peer || !stream) return

    socket.emit(
      'joined-room',
      { roomId, peerId: peer.id },
      ({ participants }: { participants: string[] }) => {
        participants.forEach((otherPeerId) => {
          if (otherPeerId === peer.id) return
          if (peers[otherPeerId]) return

          console.log('calling', otherPeerId)
          const call = peer.call(otherPeerId, stream)

          call.on('stream', (remoteStream: MediaStream) => {
            dispatch(addPeerAction(otherPeerId, remoteStream))
          })
        })
      },
    )
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        joinChannel,
        currentChannel,
        newMessageRecieved,
        leaveChannel,
        joinVideoCall,
        peer,
        stream,
        setStream,
        peers,
        dispatch,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}
