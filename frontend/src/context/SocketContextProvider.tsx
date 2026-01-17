import { createContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'

type SocketContextType = {
  socket: Socket | null
  joinChannel: (channelId: string) => void
  currentChannel: string
  newMessageRecieved: any
  leaveChannel: () => void
  joinVideoCall: (workspaceId:string) => void
}
   
export const SocketContext = createContext<SocketContextType>({
  socket: null,
  joinChannel: () => {},
  currentChannel: '',
  newMessageRecieved: null,
  leaveChannel: () => {},
  joinVideoCall:()=>{}
})

export const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null)
  const [currentChannel, setCurrentChannel] = useState('')
  const navigate = useNavigate()
  const [newMessageRecieved, setNewMessageRecieved] = useState<any>(null)


  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_BACKEND_SOCKET_URL)



    socketRef.current.on('newMessageRecieved', (data) => {

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
        setCurrentChannel(res.data)
      },
    )
  }
  
  const joinVideoCall = (workspaceId:string) =>{
    if(!socketRef.current) return 
    socketRef.current.emit('joinVideoCall',{workspaceId},(res:{success:boolean;data:string})=>{
      console.log("response after joining video call",res.data)
    })
    navigate(`/workspace/${workspaceId}/videoRoom`)
    console.log("Joining Video Call event emitted")
  }

  const leaveChannel = () => {
    socketRef.current?.disconnect()
  }

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        joinChannel,
        currentChannel,
        newMessageRecieved,
        joinVideoCall,
        leaveChannel,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}
       