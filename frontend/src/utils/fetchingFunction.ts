import useSocket from '@/hooks/context/useSocket'

export const fetchLocalStream = async (): Promise<MediaStream | null> => {
  const { setStream } = useSocket()
  try {
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    setStream(localStream)
    return localStream
  } catch (err) {
    console.error('Error accessing camera/mic:', err)
    return null
  }
}
export const fetchParticipantsList = ({
  roomId,
  participants,
}: {
  roomId: string
  participants: string[]
}) => {
  console.log('participants recieved', participants, roomId)
}
