import { SocketContext } from '@/context/SocketContextProvider'
import { useContext } from 'react'

const useSocket = () => {
  const { joinChannel, socket, currentChannel, newMessageRecieved } = useContext(SocketContext)

  return {
    joinChannel,
    socket,
    currentChannel,
    newMessageRecieved,
  }
}

export default useSocket
