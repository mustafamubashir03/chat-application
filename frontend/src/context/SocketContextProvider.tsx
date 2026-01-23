import {
  createContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react'
import { io, Socket } from 'socket.io-client'
import Peer from 'peerjs'
import { useAuth } from '@/hooks/context/useAuth'
import { peerReducer } from '@/Reducers/peerReducer'
import { addPeerAction, removePeerAction } from '@/Actions/peerAction'
import { fetchParticipantsList } from '@/utils/fetchingFunction'

/* ================= TYPES ================= */

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

/* ================= CONFIG ================= */

const backendUrl = import.meta.env.VITE_BACKEND_SOCKET_URL.replace(
  /^https?:\/\//,
  ''
)

/* ================= CONTEXT ================= */

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

/* ================= PROVIDER ================= */

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const socketRef = useRef<Socket | null>(null)

  const [socket, setSocket] = useState<Socket | null>(null)
  const [currentChannel, setCurrentChannel] = useState('')
  const [newMessageRecieved, setNewMessageRecieved] = useState<any>(null)

  // video
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [peer, setPeer] = useState<Peer | null>(null)
  const [peers, dispatch] = useReducer(peerReducer, {})

  const { auth } = useAuth()

  /* ================= INIT ================= */

  useEffect(() => {
    if (!auth?.user) return

    let active = true

    const init = async () => {
      /* -------- MEDIA (FIX #1) -------- */
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      if (!active) return
      setStream(localStream)

      /* -------- PEER -------- */
      const newPeer = new Peer(
        `${auth?.user?.id}`,
        {
          host: backendUrl.includes('localhost')
            ? 'localhost'
            : backendUrl,
          port: backendUrl.includes('localhost') ? 3001 : 443,
          path: '/peerjs/peer',
          secure: !backendUrl.includes('localhost'),
        }
      )

      setPeer(newPeer)

      /* -------- SOCKET -------- */
      const newSocket = io(import.meta.env.VITE_BACKEND_SOCKET_URL, {
        transports: ['websocket'],
        withCredentials: false,
      })

      socketRef.current = newSocket
      setSocket(newSocket)

      /* -------- EXISTING LOGIC (UNTOUCHED) -------- */
      newSocket.on('connect', () =>
        console.log('🟢 Socket connected:', newSocket.id)
      )
      newSocket.on('newMessageRecieved', setNewMessageRecieved)
      newSocket.on('get-users', fetchParticipantsList)

      /* -------- VIDEO EVENTS -------- */

      newPeer.on('call', (call) => {
        console.log('📥 incoming call from', call.peer)
        call.answer(localStream)

        call.on('stream', (remoteStream) => {
          dispatch(addPeerAction(call.peer, remoteStream))
        })
      })

      newPeer.on('error', console.error)
    }

    init()

    return () => {
      active = false
      socketRef.current?.disconnect()
      setSocket(null)
      stream?.getTracks().forEach((t) => t.stop())
      peer?.destroy()
    }
  }, [auth?.user])

  /* ================= CHANNELS (UNCHANGED) ================= */

  const joinChannel = (channelId: string) => {
    if (!socketRef.current) return
    socketRef.current.emit(
      'joinChannel',
      { channelId },
      (res: { success: boolean; data: string }) => {
        setCurrentChannel(res.data)
      }
    )
  }

  const leaveChannel = (channelId: string) => {
    if (!socketRef.current) return
    socketRef.current.emit('leaveChannel', { channelId })
    setCurrentChannel('')
  }

  /* ================= VIDEO CALL (FIXED) ================= */

  const joinVideoCall = (roomId: string) => {
    if (!socket || !peer || !stream) return

    socket.emit(
      'joined-room',
      { roomId, peerId: peer.id },
      ({ participants }: { participants: string[] }) => {
        participants.forEach((otherPeerId) => {
          if (otherPeerId === peer.id) return
          if (peers[otherPeerId]) return

          console.log('📞 calling', otherPeerId)
          const call = peer.call(otherPeerId, stream)

          call.on('stream', (remoteStream) => {
            dispatch(addPeerAction(otherPeerId, remoteStream))
          })
        })
      }
    )
  }

  /* ================= PROVIDER ================= */

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
