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

  const joinedRef = useRef(false)
  const readyRef = useRef(false)

  const meetingUrl = `${window.location.origin}/workspace/${workspaceId}/videoRoom`

  /* ================= JOIN ROOM ================= */
  useEffect(() => {
    if (!socket || !peer?.id || !workspaceId) return
    if (joinedRef.current) return

    socket.emit('joined-room', {
      roomId: workspaceId,
      peerId: peer.id,
    })

    joinedRef.current = true
  }, [socket, peer?.id, workspaceId])

  /* ================= SOCKET EVENTS ================= */
  useEffect(() => {
    if (!socket || !peer || !stream) return

    // Existing users
    const handleGetUsers = ({
      participants,
    }: {
      roomId: string
      participants: string[]
    }) => {
      participants.forEach((id) => {
        if (id === peer.id) return
        if (peers[id]) return

        const call = peer.call(id, stream)
        call.on('stream', (remoteStream) => {
          dispatch(addPeerAction(call.peer, remoteStream))
        })
      })
    }

    // New user joined
    const handleUserJoined = ({ peerId }: { peerId: string }) => {
      if (peerId === peer.id) return

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

  /* ================= PEER EVENTS ================= */
  useEffect(() => {
    if (!peer || !stream || !socket || !workspaceId) return

    peer.on('call', (call) => {
      call.answer(stream)
      call.on('stream', (remoteStream) => {
        dispatch(addPeerAction(call.peer, remoteStream))
      })
    })

    peer.on('open', (id) => {
      if (readyRef.current) return

      socket.emit('ready', {
        roomId: workspaceId,
        peerId: id,
      })

      readyRef.current = true
    })
  }, [peer, stream, socket, workspaceId, dispatch])

  /* ================= UI ================= */
  return (
    <div className="w-full min-h-screen flex flex-col text-slate-200">
      <div className="px-4 py-3 border-b border-slate-700">
        <h1 className="text-sm font-semibold">Video Meeting</h1>
      </div>

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
            <Button size="sm">Copy</Button>
          </div>
        )}
      </div>

      <div className="flex-1 p-4 space-y-4">
        {stream && <UserVideoFeedPlayer stream={stream} />}

        {Object.keys(peers).map((peerId) => (
          <UserVideoFeedPlayer
            key={peerId}
            stream={peers[peerId].stream}
          />
        ))}
      </div>
    </div>
  )
}

export default VideoRoom
