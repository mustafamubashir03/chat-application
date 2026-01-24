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

export const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null)

  const [socket, setSocket] = useState<Socket | null>(null)
  const [currentChannel, setCurrentChannel] = useState('')
  const [newMessageRecieved, setNewMessageRecieved] = useState<any>(null)

  // video
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [peer, setPeer] = useState<Peer | null>(null)
  const [peers, dispatch] = useReducer(peerReducer, {})

  const { auth } = useAuth()
  const PEERJS_HOST = import.meta.env.PEERJS_HOST
  const PEERJS_PORT = import.meta.env.PEERJS_PORT
  const PEERJS_PATH = import.meta.env.PEERJS_PATH

  useEffect(() => {
    if (!auth?.user) return

    let active = true

    const init = async () => {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      if (!active) return
      setStream(localStream)

      const newPeer = new Peer(`${auth?.user?.id}`, {
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

      setPeer(newPeer)

      const newSocket = io(import.meta.env.VITE_BACKEND_SOCKET_URL, {
        path: '/socket.io',
        withCredentials: false,
      })

      socketRef.current = newSocket
      setSocket(newSocket)

      newSocket.on('connect', () => console.log('🟢 Socket connected:', newSocket.id))
      newSocket.on('newMessageRecieved', setNewMessageRecieved)
      newSocket.on('get-users', fetchParticipantsList)

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

          console.log('📞 calling', otherPeerId)
          const call = peer.call(otherPeerId, stream)

          call.on('stream', (remoteStream) => {
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
