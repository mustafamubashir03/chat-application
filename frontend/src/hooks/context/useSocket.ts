import { SocketContext } from '@/context/SocketContextProvider'
import { useContext } from 'react'

const useSocket = () => {
  const { joinChannel, socket, currentChannel,messageRecieved,newMessageRecieved} = useContext(SocketContext)

  return {
    joinChannel,
    socket,
    currentChannel,
    messageRecieved,
    newMessageRecieved
  }
}

export default useSocket
