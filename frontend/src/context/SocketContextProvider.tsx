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
  peerReady: boolean
  stream: MediaStream | null
  peers: Record<string, { stream: MediaStream }>
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
  peerReady: false,
  stream: null,
  peers: {},
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

  // ---- Get local media ----
  const fetchLocalStream = async (): Promise<MediaStream | null> => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setStream(localStream)
      return localStream
    } catch (err) {
      console.error('Error accessing camera/mic:', err)
      return null
    }
  }

  useEffect(() => {
    if (!auth?.user) return

    // ---- Initialize PeerJS ----
    const newPeer = new Peer(`${auth.user.id}-${Math.floor(Math.random() * 10000)}`, {
      host: backendUrl.includes('localhost') ? 'localhost' : backendUrl.replace(/^https?:\/\//, ''),
      port: backendUrl.includes('localhost') ? 3000 : window.location.protocol === 'https:' ? 443 : 80,
      path: '/peerjs/peer',
    })
    setPeer(newPeer)

    // ---- Initialize Socket ----
    const newSocket = io(import.meta.env.VITE_BACKEND_SOCKET_URL, {
      auth: { token: auth.token },
    })
    socketRef.current = newSocket
    setSocket(newSocket)

    newSocket.on('connect', () => console.log('🟢 Socket connected:', newSocket.id))
    newSocket.on('newMessageRecieved', setNewMessageRecieved)

    // Handle when a peer leaves
    newSocket.on('user-left', ({ peerId }) => {
      console.log('user-left received:', peerId)
      dispatch(removePeerAction(peerId))
    })

    // ---- PeerJS open ----
    newPeer.on('open', async (id) => {
      console.log('PeerJS ready with ID:', id)

      const localStream = await fetchLocalStream()
      if (localStream) {
        setPeerReady(true)
        // emit ready only after local stream exists
        newSocket.emit('ready', { peerId: id })
      }
    })

    newPeer.on('error', (err) => console.error('PeerJS error:', err))

    return () => {
      // ---- Cleanup ----
      newSocket.disconnect()
      socketRef.current = null
      setSocket(null)
      stream?.getTracks().forEach((track) => track.stop())
      newPeer.destroy()
    }
  }, [auth?.user])

  // ---- Handle peer connections ----
  useEffect(() => {
    if (!peer || !socket || !stream) return


    peer.on('call', (call) => {
      if (!stream) return
      call.answer(stream)
      call.on('stream', (remoteStream) => {
        dispatch(addPeerAction(call.peer, remoteStream))
      })
    })
    
    socket.on('user-joined', ({ peerId }) => {
      if (!peerId || peerId === peer?.id || peers[peerId] || !stream) return
    
      const call = peer.call(peerId, stream)
      call.on('stream', (remoteStream) => {
        dispatch(addPeerAction(peerId, remoteStream))
      })
    })
    socket.on('user-left', ({ peerId }) => {
      if (!peerId) return
      dispatch(removePeerAction(peerId))
    })
    
    

    return () => {
      socket?.disconnect()
      peer?.destroy()
      stream?.getTracks().forEach(track => track.stop())
    }
    
  }, [peer, stream, socket, peers])

  // ---- Channels ----
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

  // ---- Video call ----
  const joinVideoCall = async (roomId: string, peer: Peer) => {
    if (!socket || !peer || !peerReady || !stream) return
  
    const emitJoin = () => {
      socket.emit('joinVideoCall', { roomId, peerId: peer.id }, (response: { participants: string[] }) => {
        console.log('after joining emission', response)
  
        // Call existing participants
        response.participants.forEach((otherPeerId) => {
          if (otherPeerId !== peer.id && !peers[otherPeerId]) {
            const call = peer.call(otherPeerId, stream)
            call.on('stream', (remoteStream) => {
              dispatch(addPeerAction(otherPeerId, remoteStream))
            })
          }
        })
      })
    }
  
    if (!socket.connected) {
      socket.once('connect', emitJoin)
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
