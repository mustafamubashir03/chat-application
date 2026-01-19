import { SocketContext } from '@/context/SocketContextProvider'
import { useContext } from 'react'

const useSocket = () => {
  const {
    joinChannel,
    joinVideoCall,
    socket,
    currentChannel,
    newMessageRecieved,
    peer,
    stream,
    peerReady,
    peers,
  } = useContext(SocketContext)

  return {
    joinChannel,
    socket,
    currentChannel,
    newMessageRecieved,
    joinVideoCall,
    peer,
    stream,
    peerReady,
    peers,
  }
}

export default useSocket
