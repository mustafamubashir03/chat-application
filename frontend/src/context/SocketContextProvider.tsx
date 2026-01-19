import { createContext, useEffect, useReducer, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import Peer from 'peerjs'
import { useAuth } from '@/hooks/context/useAuth'
import { peerReducer } from '@/Reducers/peerReducer'
import { addPeerAction } from '@/Actions/peerAction'

type SocketContextType = {
  socket: Socket | null
  joinChannel: (channelId: string) => void
  currentChannel: string
  newMessageRecieved: any
  leaveChannel: (channelId: string) => void
  joinVideoCall: (workspaceId: string, peer: Peer) => void
  peer: Peer | null
  peerReady: Boolean
  stream: MediaStream | null
  peers: any
}
const backendUrl = import.meta.env.VITE_BACKEND_SOCKET_URL.replace(/^https?:\/\//, '')

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  joinChannel: () => {},
  currentChannel: '',
  newMessageRecieved: null,
  leaveChannel: () => {},
  joinVideoCall: () => {},
  peer: null,
  stream: null,
  peerReady: false,
  peers: null,
})

export const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [currentChannel, setCurrentChannel] = useState('')
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [peerReady, setPeerReady] = useState<Boolean>(false)
  const [peer, setPeer] = useState<Peer | null>(null)
  const [peers, dispatch] = useReducer(peerReducer, {})
  const { auth } = useAuth()

  const [newMessageRecieved, setNewMessageRecieved] = useState<any>(null)
  const fetchUserFeedStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      console.log('MediaStream obtained:', stream)
      setStream(stream)
    } catch (err) {
      console.error('Error accessing camera/mic:', err)
    }
  }

  useEffect(() => {
    if (!auth?.user) return

    const newPeer = new Peer(auth.user.id, {
      host: backendUrl.includes('localhost') ? 'localhost' : backendUrl.replace(/^https?:\/\//, ''),
      port: backendUrl.includes('localhost')
        ? 3000
        : window.location.protocol === 'https:'
          ? 443
          : 80,
      path: '/peerjs/peer',
    })

    newPeer.on('open', (id) => {
      console.log('PeerJS ready with ID:', id)
      setPeer(newPeer)
      setPeerReady(true)
      fetchUserFeedStream()
    })

    newPeer.on('error', (err) => {
      console.error('PeerJS error:', err)
    })

    /* ---------- SOCKET ---------- */
    const newSocket = io(import.meta.env.VITE_BACKEND_SOCKET_URL, {
      auth: {
        token: auth.token,
      },
    })

    socketRef.current = newSocket
    setSocket(newSocket)

    newSocket.on('connect', () => {
      console.log('🟢 Socket connected:', newSocket.id)
    })

    newSocket.on('newMessageRecieved', (data) => {
      setNewMessageRecieved(data)
    })

    return () => {
      newSocket.disconnect()
      socketRef.current = null
      setSocket(null)
      newPeer.destroy()
    }
  }, [auth?.user])

  useEffect(() => {
    if (!peer || !stream) {
      return
    }
    socket?.on('user-joined', ({ peerId }: { peerId: string }) => {
      const call = peer.call(peerId, stream)
      console.log('calling the new peer', peerId)
      call.on('stream', () => {
        dispatch(addPeerAction(peerId, stream))
      })
    })
    peer.on('call', (call) => {
      console.log('recieving a call')
      call.answer(stream)
      call.on('stream', () => {
        dispatch(addPeerAction(call.peer, stream))
      })
    })
    socket?.emit('ready')
  }, [peer, stream])
  /* ---------- JOIN CHANNEL ---------- */
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

  /* ---------- LEAVE CHANNEL ---------- */
  const leaveChannel = (channelId: string) => {
    if (!socketRef.current) return
    socketRef.current.emit('leaveChannel', { channelId })
    setCurrentChannel('')
  }

  /* ---------- JOIN VIDEO CALL ---------- */
  const joinVideoCall = (roomId: string, peer: Peer) => {
    if (!socketRef.current || !peer || !peerReady) return

    const emitJoin = () => {
      socketRef.current!.emit('joinVideoCall', { roomId, peerId: peer?.id }, (response: any) => {
        console.log('after joining emission', response)
      })
    }

    if (!socketRef.current.connected) {
      socketRef.current.once('connect', emitJoin)
      return
    }

    emitJoin()
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        joinChannel,
        currentChannel,
        newMessageRecieved,
        joinVideoCall,
        leaveChannel,
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
