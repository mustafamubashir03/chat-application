import { SocketContext } from '@/context/SocketContextProvider'
import { useContext } from 'react'

const useSocket = () => {
  const {
    joinChannel,
    leaveChannel,
    joinVideoCall,
    socket,
    currentChannel,
    newMessageRecieved,
    peer,
    stream,
    setStream,
    peers,
    dispatch,
  } = useContext(SocketContext)

  return {
    joinChannel,
    leaveChannel,
    socket,
    currentChannel,
    newMessageRecieved,
    setStream,
    joinVideoCall,
    peer,
    stream,
    peers,
    dispatch,
  }
}

export default useSocket
