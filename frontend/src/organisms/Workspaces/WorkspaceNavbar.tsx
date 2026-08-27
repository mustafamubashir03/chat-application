import { Button } from '@/components/ui/button'
import { useGetWorkspaceById } from '@/hooks/apis/workspace/useGetWorkspaceById'
import { useCurrentWorkspace } from '@/hooks/context/useCurrentWorkspace'
import useSocket from '@/hooks/context/useSocket'
import { LucideLoader2, SearchIcon, VideoIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const WorkspaceNavbar = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { isPending, workspaceDetails } = useGetWorkspaceById({ workspaceId: workspaceId || '' })
  const { setCurrentWorkspace } = useCurrentWorkspace()
  const { socket, peer } = useSocket()
  const navigate = useNavigate()

  const [activeMeeting, setActiveMeeting] = useState<any>(null)

  useEffect(() => {
    if (workspaceDetails) {
      setCurrentWorkspace(workspaceDetails)
    }
  }, [workspaceDetails, setCurrentWorkspace])

  useEffect(() => {
    if (!socket || !workspaceId) return

    socket.emit('workspace:join', { workspaceId })
    socket.emit('workspace:get-meeting-status', { workspaceId }, (meeting: any) => {
      setActiveMeeting(meeting)
    })

    const handleMeetingStatus = (data: { workspaceId: string; meeting: any }) => {
      if (data.workspaceId === workspaceId) {
        setActiveMeeting(data.meeting)
      }
    }

    const handleMeetingStarted = (meeting: any) => {
      if (meeting?.workspaceId === workspaceId) {
        setActiveMeeting(meeting)
      }
    }

    const handleMeetingUpdated = (meeting: any) => {
      if (meeting?.workspaceId === workspaceId) {
        setActiveMeeting(meeting)
      }
    }

    const handleMeetingEnded = (data: { workspaceId: string }) => {
      if (data.workspaceId === workspaceId) {
        setActiveMeeting(null)
      }
    }

    socket.on('workspace:meeting-status', handleMeetingStatus)
    socket.on('workspace:meeting-started', handleMeetingStarted)
    socket.on('workspace:meeting-updated', handleMeetingUpdated)
    socket.on('workspace:meeting-ended', handleMeetingEnded)

    return () => {
      socket.off('workspace:meeting-status', handleMeetingStatus)
      socket.off('workspace:meeting-started', handleMeetingStarted)
      socket.off('workspace:meeting-updated', handleMeetingUpdated)
      socket.off('workspace:meeting-ended', handleMeetingEnded)
    }
  }, [socket, workspaceId])

  const handleStartOrJoinMeeting = () => {
    if (!workspaceId) return
    if (peer?.id) {
      if (!activeMeeting) {
        socket?.emit('create-room', { roomId: workspaceId, peerId: peer.id })
      } else {
        socket?.emit('joined-room', { roomId: workspaceId, peerId: peer.id })
      }
    }
    navigate(`/workspace/${workspaceId}/videoRoom`)
  }

  const participantCount = activeMeeting?.participants
    ? Object.keys(activeMeeting.participants).length
    : 0

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-14 p-2 bg-[#0b0d1a] text-slate-400">
        <LucideLoader2 className="size-9 animate-spin" />
      </div>
    )
  }

  return (
    <nav className="flex items-center justify-between h-14 px-6 bg-[#0b0d1a] border-b border-slate-800/60">
      <div className="flex-1"></div>
      <div>
        <Button variant={'darkBlue'} size={'sm'} className="bg-slate-900 border-slate-800">
          <SearchIcon className="size-4 mr-1 text-slate-400" />
          <span>Search {workspaceDetails?.name}</span>
        </Button>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end gap-3">
        {activeMeeting ? (
          <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-700/50 rounded-lg px-3 py-1">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="text-xs text-emerald-300 font-medium">
              Meeting in progress ({participantCount} active)
            </div>
            <Button
              onClick={handleStartOrJoinMeeting}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs ml-2 h-7"
            >
              Join Meeting
            </Button>
          </div>
        ) : (
          <Button onClick={handleStartOrJoinMeeting} variant={'indigoGlow'} size="sm">
            <VideoIcon className="size-4 mr-1" />
            Start Meeting
          </Button>
        )}
      </div>
    </nav>
  )
}

export default WorkspaceNavbar
