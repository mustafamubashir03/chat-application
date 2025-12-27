import { SocketContext } from '@/context/SocketContextProvider'
import { useContext } from 'react'

const useSocket = () => {
  const { joinChannel, socket, currentChannel } = useContext(SocketContext)

  return {
    joinChannel,
    socket,
    currentChannel,
  }
}

export default useSocket
