import { createContext, useEffect, useReducer, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import Peer from 'peerjs'
import { useAuth } from '@/hooks/context/useAuth'
import { peerReducer } from '@/Reducers/peerReducer'
import { addPeerAction, removePeerAction } from '@/Actions/peerAction'

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
  const [peerReady, setPeerReady] = useState(false)
  const [peer, setPeer] = useState<Peer | null>(null)
  const [peers, dispatch] = useReducer(peerReducer, {})
  const { auth } = useAuth()
  const [newMessageRecieved, setNewMessageRecieved] = useState<any>(null)

  const fetchUserFeedStream = async (): Promise<MediaStream | null> => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      console.log('MediaStream obtained:', localStream)
      setStream(localStream)
      return localStream
    } catch (err) {
      console.error('Error accessing camera/mic:', err)
      return null
    }
  }
  

  useEffect(() => {
    if (!auth?.user) return

    // ----- Initialize PeerJS -----
    const newPeer = new Peer(`${auth.user.id}-${Math.floor(Math.random() * 10000)}`, {
      host: backendUrl.includes('localhost') ? 'localhost' : backendUrl.replace(/^https?:\/\//, ''),
      port: backendUrl.includes('localhost') ? 3000 : window.location.protocol === 'https:' ? 443 : 80,
      path: '/peerjs/peer',
    })

    newPeer.on('open', async (id) => {
      console.log('PeerJS ready with ID:', id)
      setPeer(newPeer)
      setPeerReady(true)
      
      const localStream = await fetchUserFeedStream()
      
      // Only join video call after stream is ready
      if (localStream && socketRef.current) {
        socketRef.current.emit('ready', { peerId: id })
      }
    })
    

    newPeer.on('error', (err) => console.error('PeerJS error:', err))

    // ----- Initialize Socket -----
    const newSocket = io(import.meta.env.VITE_BACKEND_SOCKET_URL, {
      auth: { token: auth.token },
    })
    socketRef.current = newSocket
    setSocket(newSocket)

    newSocket.on('connect', () => console.log('🟢 Socket connected:', newSocket.id))
    newSocket.on('newMessageRecieved', setNewMessageRecieved)

    // ----- Handle users leaving -----
    newSocket.on('user-left', ({ peerId }) => {
      console.log('user-left received:', peerId)
      dispatch(removePeerAction(peerId))
    })

    return () => {
      newSocket.disconnect()
      socketRef.current = null
      setSocket(null)
      newPeer.destroy()
    }
  }, [auth?.user])

  // ----- Peer Connections -----
  useEffect(() => {
    if (!peer || !stream) return
    if (!socket) return

    // When a new user joins, call them
    const handleUserJoined = ({ peerId }: { peerId: string }) => {
      if (!stream) return  // ❌ must check stream
      if (peerId === peer.id || peers[peerId]) return
      const call = peer.call(peerId, stream)
      console.log('calling new peer:', peerId)
      call.on('stream', (remoteStream) => {
        dispatch(addPeerAction(peerId, remoteStream))
      })
    }
    

    socket.on('user-joined', handleUserJoined)

    // When receiving a call
    peer.on('call', (call) => {
      console.log('receiving a call from:', call.peer)
      call.answer(stream)
      call.on('stream', (remoteStream) => {
        dispatch(addPeerAction(call.peer, remoteStream))
      })
    })

    return () => {
      socket.off('user-joined', handleUserJoined)
      peer.removeAllListeners('call')
    }
  }, [peer, stream, socket, peers])

  // ----- Channels -----
  const joinChannel = (channelId: string) => {
    if (!socketRef.current) return
    socketRef.current.emit('joinChannel', { channelId }, (res: { success: boolean; data: string }) => {
      setCurrentChannel(res.data)
    })
  }

  const leaveChannel = (channelId: string) => {
    if (!socketRef.current) return
    socketRef.current.emit('leaveChannel', { channelId })
    setCurrentChannel('')
  }

  // ----- Video Call -----
  const joinVideoCall = (roomId: string, peer: Peer) => {
    if (!socketRef.current || !peer || !peerReady) return

    const emitJoin = () => {
      socketRef.current!.emit('joinVideoCall', { roomId, peerId: peer.id }, (response: any) => {
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
        leaveChannel,
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
