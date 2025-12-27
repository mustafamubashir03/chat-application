import { createContext, useState } from 'react'
import { io } from 'socket.io-client'

export const SocketContext = createContext<{
  socket: any
  joinChannel: (channelId: string) => void
  currentChannel: string
}>({ socket: null, joinChannel: () => {}, currentChannel: '' })

export const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentChannel, setCurrentChannel] = useState<string>('')
  const socket = io(import.meta.env.VITE_BACKEND_SOCKET_URL)
  async function joinChannel(channelId: string) {
    socket.emit(
      'joinChannel',
      { channelId },
      (data: { success: boolean; message: string; data: string }) => {
        console.log('Successfully joined the channel', data)
        setCurrentChannel(data?.data)
      },
    )
  }

  return (
    <SocketContext.Provider value={{ socket, joinChannel, currentChannel }}>
      {children}
    </SocketContext.Provider>
  )
}
