import UserVideoFeedPlayer from '@/atoms/userVideoFeedPlayer/UserVideoFeedPlayer'
import { Button } from '@/components/ui/button'
import useSocket from '@/hooks/context/useSocket'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

interface PeerData {
  stream: MediaStream
}

const VideoRoom = () => {
  const { joinVideoCall, socket, peer, stream, peers } = useSocket()
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const meetingUrl = `${window.location.origin}/workspace/${workspaceId}/videoRoom`
  const [showInvite, setShowInvite] = useState(false)

  const copyMeetingLink = async () => {
    try {
      await navigator.clipboard.writeText(meetingUrl)
      alert('Meeting link copied to clipboard')
    } catch (err) {
      console.error('Failed to copy link', err)
    }
  }

  const handleGetUsers = ({ roomId, participants }: { roomId: string; participants: string[] }) => {
    console.log('fetched room id and participants', roomId, participants)
  }

  useEffect(() => {
    if (!socket) return

    socket.on('get-users', handleGetUsers)

    return () => {
      socket.off('get-users', handleGetUsers)
    }
  }, [socket])

  useEffect(() => {
    if (!workspaceId || !socket || !peer?.id) return
    joinVideoCall(workspaceId)
  }, [workspaceId, socket, peer?.id])

  const peerEntries = peers ? Object.entries(peers) as [string, PeerData][] : []

  return (
    <div className="w-full min-h-screen flex flex-col text-slate-200">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <div>
          <h1 className="text-sm font-semibold">Video Meeting</h1>
          <p className="text-xs text-slate-400">Room • Live</p>
        </div>
        <div className="text-xs text-slate-400">
          {peerEntries.length + (stream ? 1 : 0)} participant
          {peerEntries.length + (stream ? 1 : 0) > 1 ? 's' : ''}
        </div>
      </div>

      {/* ===== INVITE LINK COLLAPSIBLE ===== */}
      <div className="px-4 py-2 border-b border-slate-700 bg-slate-800/50">
        <button
          className="text-xs text-blue-400 underline hover:text-blue-300"
          onClick={() => setShowInvite(!showInvite)}
        >
          {showInvite ? 'Hide invite link' : 'Show invite link'}
        </button>

        {showInvite && (
          <div className="mt-2 flex flex-col md:flex-row md:items-center gap-2">
            <input
              value={meetingUrl}
              readOnly
              className="flex-1 w-full px-2 py-1 rounded-md bg-slate-700 border border-slate-600 text-xs text-slate-200 truncate focus:outline-none"
              title={meetingUrl}
            />
            <Button onClick={copyMeetingLink} variant="primary" size="sm">
              Copy
            </Button>
          </div>
        )}
        {showInvite && (
          <p className="mt-1 text-[10px] text-slate-400">
            Participants must belong to the <span className="font-medium">same workspace</span>.
          </p>
        )}
      </div>

      {/* ===== MAIN VIDEO CONTENT ===== */}
      <div className="flex-1 flex flex-col gap-6 px-2 py-2 overflow-y-auto">
        {/* YOUR VIDEO */}
        {stream && (
          <div className="flex justify-center">
            <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
              <UserVideoFeedPlayer stream={stream} />
            </div>
          </div>
        )}

        {/* PARTICIPANTS */}
        {peerEntries.length > 0 ? (
          <div className="flex flex-col gap-4">
            {peerEntries.map(([peerId, peerData]) => (
              <div key={peerId} className="w-full max-w-md mx-auto">
                {peerData?.stream && <UserVideoFeedPlayer stream={peerData.stream} />}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-slate-400 text-sm mt-6 gap-1">
            <p>No one else is here yet</p>
            <p className="text-xs">Share the meeting link to invite others</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoRoom
