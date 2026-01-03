import { createContext, useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

type SocketContextType = {
  socket: Socket | null
  joinChannel: (channelId: string) => void
  currentChannel: string
  newMessageRecieved: any
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  joinChannel: () => {},
  currentChannel: '',
  newMessageRecieved: null,
})

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const socketRef = useRef<Socket | null>(null) 

  const [currentChannel, setCurrentChannel] = useState('')
  const [newMessageRecieved, setNewMessageRecieved] = useState<any>(null)

  /* ---------- CREATE SOCKET ONCE ---------- */
  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_BACKEND_SOCKET_URL)

    console.log('✅ Socket connected')

    socketRef.current.on('newMessageRecieved', (data) => {
      console.log('📩 SOCKET MESSAGE RECEIVED', data)
      setNewMessageRecieved(data)
    })

    return () => {
      socketRef.current?.disconnect()
      socketRef.current = null
    }
  }, [])

  /* ---------- JOIN CHANNEL ---------- */
  const joinChannel = (channelId: string) => {
    if (!socketRef.current) return

    socketRef.current.emit(
      'joinChannel',
      { channelId },
      (res: { success: boolean; data: string }) => {
        console.log('✅ Joined channel', res)
        setCurrentChannel(res.data)
      }
    )
  }

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        joinChannel,
        currentChannel,
        newMessageRecieved,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}
