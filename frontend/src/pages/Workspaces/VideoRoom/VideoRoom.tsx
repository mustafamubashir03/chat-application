import { addPeerAction } from '@/Actions/peerAction'
import UserVideoFeedPlayer from '@/atoms/userVideoFeedPlayer/UserVideoFeedPlayer'
import { Button } from '@/components/ui/button'
import useSocket from '@/hooks/context/useSocket'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

const VideoRoom = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { socket, peer, peers, stream, dispatch } = useSocket()

  const [showInvite, setShowInvite] = useState(false)
  const [copied, setCopied] = useState(false)
  const [joinNotice, setJoinNotice] = useState<string | null>(null)

  const joinedRef = useRef(false)
  const readyRef = useRef(false)

  const meetingUrl = `${window.location.origin}/workspace/${workspaceId}/videoRoom`


  useEffect(() => {
    if (!socket || !peer?.id || !workspaceId) return
    if (joinedRef.current) return

    socket.emit('joined-room', {
      roomId: workspaceId,
      peerId: peer.id,
    })

    joinedRef.current = true
  }, [socket, peer?.id, workspaceId])


  useEffect(() => {
    if (!socket || !peer || !stream) return

    const handleGetUsers = ({ participants }: { participants: string[] }) => {
      participants.forEach((id) => {
        if (id === peer.id) return
        if (peers[id]) return

        const call = peer.call(id, stream)

        call.on('stream', (remoteStream) => {
          dispatch(addPeerAction(call.peer, remoteStream))
        })
      })
    }

    const handleUserJoined = ({ peerId }: { peerId: string }) => {
      if (peerId === peer.id) return
      if (peers[peerId]) return

      setJoinNotice('Someone joined the meeting')
      setTimeout(() => setJoinNotice(null), 3000)

      const call = peer.call(peerId, stream)

      call.on('stream', (remoteStream) => {
        dispatch(addPeerAction(call.peer, remoteStream))
      })
    }

    socket.on('get-users', handleGetUsers)
    socket.on('user-joined', handleUserJoined)

    return () => {
      socket.off('get-users', handleGetUsers)
      socket.off('user-joined', handleUserJoined)
    }
  }, [socket, peer, stream, peers, dispatch])


  useEffect(() => {
    if (!peer || !stream || !socket || !workspaceId) return

    const handleCall = (call: any) => {
      if (peers[call.peer]) return

      call.answer(stream)

      call.on('stream', (remoteStream: MediaStream) => {
        dispatch(addPeerAction(call.peer, remoteStream))
      })
    }

    peer.on('call', handleCall)

    peer.on('open', (id) => {
      if (readyRef.current) return

      socket.emit('ready', {
        roomId: workspaceId,
        peerId: id,
      })

      readyRef.current = true
    })

    return () => {
      peer.off('call', handleCall)
    }
  }, [peer, stream, socket, workspaceId, peers, dispatch])

  const totalParticipants = 1 + Object.keys(peers).length

  /* ================= UI ================= */
  return (
    <div className="w-full min-h-screen flex flex-col text-slate-200">
      <div className="px-4 py-3 border-b border-slate-700 flex justify-between items-center">
        <h1 className="text-sm font-semibold">Video Meeting</h1>
        <span className="text-xs text-slate-400">
          {totalParticipants} participant{totalParticipants > 1 ? 's' : ''}
        </span>
      </div>

      {joinNotice && (
        <div className="px-4 py-2 text-xs bg-green-900/30 text-green-400 border-b border-green-700">
          {joinNotice}
        </div>
      )}

      <div className="px-4 py-2 border-b border-slate-700 bg-slate-800/50">
        <button
          className="text-xs text-blue-400 underline"
          onClick={() => setShowInvite(!showInvite)}
        >
          {showInvite ? 'Hide invite link' : 'Show invite link'}
        </button>

        {showInvite && (
          <div className="mt-2 flex gap-2">
            <input
              value={meetingUrl}
              readOnly
              className="flex-1 px-2 py-1 bg-slate-700 text-xs rounded"
            />
            <Button
              size="sm"
              onClick={async () => {
                await navigator.clipboard.writeText(meetingUrl)
                setCopied(true)
                setTimeout(() => setCopied(false), 1500)
              }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 p-4 space-y-4">
        {stream && <UserVideoFeedPlayer stream={stream} isLocal />}

        {Object.keys(peers).map((peerId) => (
          <UserVideoFeedPlayer key={peerId} stream={peers[peerId].stream} />
        ))}
      </div>
    </div>
  )
}

export default VideoRoom
