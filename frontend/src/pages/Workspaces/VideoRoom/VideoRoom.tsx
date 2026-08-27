import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { addPeerAction, removePeerAction } from '@/Actions/peerAction'
import UserVideoFeedPlayer from '@/atoms/userVideoFeedPlayer/UserVideoFeedPlayer'
import { Button } from '@/components/ui/button'
import useSocket from '@/hooks/context/useSocket'
import { useAuth } from '@/hooks/context/useAuth'
import { createInvitation } from '@/apis/invitation'
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Users,
  Loader2,
  AlertTriangle,
  LinkIcon,
} from 'lucide-react'
import { toast } from 'sonner'

const VideoRoom = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { socket, peer, peers, stream, dispatch } = useSocket()
  const { auth } = useAuth()
  const navigate = useNavigate()

  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const [copied, setCopied] = useState(false)
  const [generatingLink, setGeneratingLink] = useState(false)
  const [joinNotice, setJoinNotice] = useState<string | null>(null)
  const [connectionError] = useState<string | null>(null)

  const joinedRef = useRef(false)

  // 1. Join room on mount
  useEffect(() => {
    if (!socket || !peer?.id || !workspaceId) return
    if (joinedRef.current) return

    socket.emit('joined-room', {
      roomId: workspaceId,
      peerId: peer.id,
      user: {
        id: auth?.user?.id,
        username: auth?.user?.username || 'Member',
      },
    })

    joinedRef.current = true
  }, [socket, peer?.id, workspaceId, auth?.user])

  // 2. Peer signaling: Joiner calls existing participants; existing participants only handle user-left
  useEffect(() => {
    if (!socket || !peer || !stream) return

    const handleGetUsers = ({ participants }: { participants: string[] }) => {
      participants.forEach((id) => {
        if (id === peer.id) return
        if (peers[id]) return

        console.log('Outgoing joiner call to existing peer:', id)
        const call = peer.call(id, stream)

        call.on('stream', (remoteStream: MediaStream) => {
          dispatch(addPeerAction(id, remoteStream))
        })

        call.on('error', (err: any) => {
          console.error('Call error with peer', id, err)
        })
      })
    }

    const handleUserJoined = ({ user, peerId }: { user?: any; peerId: string }) => {
      if (peerId === peer.id) return
      const joinerName = user?.username || 'Someone'
      setJoinNotice(`${joinerName} joined the meeting`)
      setTimeout(() => setJoinNotice(null), 3500)
    }

    const handleUserLeft = ({ peerId }: { peerId: string }) => {
      console.log('Peer left video room:', peerId)
      dispatch(removePeerAction(peerId))
      setJoinNotice('A participant left the meeting')
      setTimeout(() => setJoinNotice(null), 3000)
    }

    socket.on('get-users', handleGetUsers)
    socket.on('user-joined', handleUserJoined)
    socket.on('user-left', handleUserLeft)

    return () => {
      socket.off('get-users', handleGetUsers)
      socket.off('user-joined', handleUserJoined)
      socket.off('user-left', handleUserLeft)
    }
  }, [socket, peer, stream, peers, dispatch])

  // 3. Handle media toggles
  const toggleMic = () => {
    if (!stream) return
    const audioTracks = stream.getAudioTracks()
    audioTracks.forEach((track) => {
      track.enabled = !micOn
    })
    setMicOn((prev) => !prev)
    if (socket && workspaceId && peer?.id) {
      socket.emit('toggle-media', {
        roomId: workspaceId,
        peerId: peer.id,
        micOn: !micOn,
      })
    }
  }

  const toggleCamera = () => {
    if (!stream) return
    const videoTracks = stream.getVideoTracks()
    videoTracks.forEach((track) => {
      track.enabled = !cameraOn
    })
    setCameraOn((prev) => !prev)
    if (socket && workspaceId && peer?.id) {
      socket.emit('toggle-media', {
        roomId: workspaceId,
        peerId: peer.id,
        cameraOn: !cameraOn,
      })
    }
  }

  // 4. Leave meeting
  const handleLeaveMeeting = () => {
    if (socket && workspaceId) {
      socket.emit('leave-room')
    }
    if (workspaceId) {
      navigate(`/workspace/${workspaceId}`)
    } else {
      navigate('/home')
    }
  }

  // 5. Copy Single Invitation Link
  const handleCopyInviteLink = async () => {
    if (!workspaceId || !auth?.token) return
    try {
      setGeneratingLink(true)
      const res = await createInvitation({ workspaceId, token: auth.token })
      const token = res?.data?.token
      if (token) {
        const inviteUrl = `${window.location.origin}/invite/${token}`
        await navigator.clipboard.writeText(inviteUrl)
        setCopied(true)
        toast.success('Invitation link copied!')
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (e: any) {
      toast.error(e?.message || 'Failed to generate invitation link')
    } finally {
      setGeneratingLink(false)
    }
  }

  const remotePeerIds = Object.keys(peers)
  const totalParticipants = 1 + remotePeerIds.length

  // Dynamic Grid Columns layout
  const getGridColsClass = () => {
    if (totalParticipants === 1) return 'grid-cols-1 max-w-3xl mx-auto'
    if (totalParticipants === 2) return 'grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto'
    if (totalParticipants <= 4) return 'grid-cols-1 md:grid-cols-2 max-w-6xl mx-auto'
    return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-7xl mx-auto'
  }

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col text-slate-200">
      {/* Top Bar */}
      <header className="h-14 px-6 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="size-3 bg-red-500 rounded-full animate-pulse" />
          <h1 className="text-sm font-semibold text-slate-200">Workspace Video Meeting</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/50">
            <Users className="size-3.5 text-blue-400" />
            <span>
              {totalParticipants} participant{totalParticipants > 1 ? 's' : ''}
            </span>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleCopyInviteLink}
            disabled={generatingLink}
            className="text-xs bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            {generatingLink ? (
              <Loader2 className="size-3.5 animate-spin mr-1.5" />
            ) : (
              <LinkIcon className="size-3.5 mr-1.5 text-blue-400" />
            )}
            {copied ? 'Copied Link!' : 'Invite Members'}
          </Button>
        </div>
      </header>

      {/* Notifications */}
      {joinNotice && (
        <div className="px-4 py-2 text-xs bg-blue-950/60 text-blue-300 border-b border-blue-800/60 text-center animate-in fade-in">
          {joinNotice}
        </div>
      )}

      {connectionError && (
        <div className="px-4 py-2 text-xs bg-red-950/60 text-red-300 border-b border-red-800/60 text-center flex items-center justify-center gap-2">
          <AlertTriangle className="size-4" />
          <span>{connectionError}</span>
        </div>
      )}

      {/* Main Video Stage */}
      <main className="flex-1 p-6 flex flex-col justify-center overflow-y-auto">
        {!stream ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
            <Loader2 className="size-8 animate-spin text-blue-500" />
            <p className="text-sm font-medium">Accessing camera and microphone...</p>
          </div>
        ) : (
          <div className={`grid gap-4 w-full items-center justify-center ${getGridColsClass()}`}>
            {/* Local User Stream */}
            <UserVideoFeedPlayer
              stream={stream}
              isLocal
              username={`${auth?.user?.username || 'You'} (You)`}
            />

            {/* Remote Participants Streams */}
            {remotePeerIds.map((peerId) => (
              <UserVideoFeedPlayer
                key={peerId}
                stream={peers[peerId].stream}
                isLocal={false}
                username={`Participant`}
              />
            ))}
          </div>
        )}
      </main>

      {/* Control Bar Footer */}
      <footer className="h-20 border-t border-slate-800/80 bg-slate-900/80 backdrop-blur flex items-center justify-center gap-4 z-10 px-4">
        <Button
          onClick={toggleMic}
          size="icon"
          variant="outline"
          className={`size-12 rounded-full border-slate-700 text-white transition-all ${
            micOn ? 'bg-slate-800 hover:bg-slate-700' : 'bg-red-600 hover:bg-red-500 border-red-500'
          }`}
        >
          {micOn ? <Mic className="size-5" /> : <MicOff className="size-5" />}
        </Button>

        <Button
          onClick={toggleCamera}
          size="icon"
          variant="outline"
          className={`size-12 rounded-full border-slate-700 text-white transition-all ${
            cameraOn ? 'bg-slate-800 hover:bg-slate-700' : 'bg-red-600 hover:bg-red-500 border-red-500'
          }`}
        >
          {cameraOn ? <Video className="size-5" /> : <VideoOff className="size-5" />}
        </Button>

        <Button
          onClick={handleLeaveMeeting}
          size="icon"
          className="size-12 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 transition-all ml-4"
        >
          <PhoneOff className="size-5" />
        </Button>
      </footer>
    </div>
  )
}

export default VideoRoom
