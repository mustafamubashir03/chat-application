import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/context/useAuth'
import { getMeetingInviteByToken } from '@/apis/meeting'
import { Loader2, Video, Users, AlertCircle, VideoOff } from 'lucide-react'

const MeetingInvitePage = () => {
  const { meetingToken } = useParams<{ meetingToken: string }>()
  const { auth } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [loading, setLoading] = useState(true)
  const [meetingData, setMeetingData] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!auth?.token) {
      navigate('/auth/signin', { state: { from: location } })
      return
    }

    if (!meetingToken) return

    const fetchDetails = async () => {
      try {
        setLoading(true)
        const response = await getMeetingInviteByToken({
          meetingToken,
          token: auth.token || '',
        })
        setMeetingData(response?.data)
      } catch (err: any) {
        setErrorMsg(
          err?.message ? String(err.message) : 'This meeting invitation is invalid or has expired.',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [meetingToken, auth?.token])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200 p-4">
        <Loader2 className="animate-spin size-8 text-emerald-400 mb-4" />
        <p className="text-slate-400 text-sm">Validating meeting invitation...</p>
      </div>
    )
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200 p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-6 text-center shadow-xl">
          <AlertCircle className="size-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-100 mb-2">Meeting Invitation Unavailable</h2>
          <p className="text-slate-400 text-sm mb-6">{errorMsg}</p>
          <Button onClick={() => navigate('/home')} variant="outline" className="w-full">
            Back to Workspace Home
          </Button>
        </div>
      </div>
    )
  }

  const { workspaceId, workspaceName, isMember, isActiveMeeting } = meetingData || {}

  // Not a member of the workspace: meeting invites grant meeting access only,
  // not workspace membership. Guide them to join the workspace first.
  if (!isMember) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200 p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl text-center">
          <div className="size-16 bg-amber-600/20 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="size-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100 mb-2">Join the workspace first</h1>
          <p className="text-slate-400 text-sm mb-6">
            You need to be a member of{' '}
            <strong className="text-slate-200">{workspaceName || 'the workspace'}</strong> before you
            can join its meeting. Ask a workspace member for a workspace invitation.
          </p>
          <Button onClick={() => navigate('/home')} variant="darkBlue" className="w-full py-4">
            Go to My Workspaces
          </Button>
        </div>
      </div>
    )
  }

  if (!isActiveMeeting) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200 p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-6 text-center shadow-xl">
          <VideoOff className="size-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-100 mb-2">This meeting has ended</h2>
          <p className="text-slate-400 text-sm mb-6">
            There is no active meeting in <strong className="text-slate-200">{workspaceName}</strong>{' '}
            right now.
          </p>
          <Button
            onClick={() => navigate(`/workspace/${workspaceId}`)}
            variant="outline"
            className="w-full"
          >
            Go to Workspace
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200 p-4">
      <div className="max-w-md w-full bg-slate-900 border border-emerald-800 rounded-xl p-8 shadow-2xl text-center">
        <div className="size-14 bg-emerald-600/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <Video className="size-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-100 mb-2">Join the meeting</h1>
        <p className="text-slate-400 text-sm mb-6">
          A meeting is in progress in{' '}
          <strong className="text-slate-200">{workspaceName}</strong>. Your camera and microphone
          will be used while you are in the meeting.
        </p>
        <Button
          onClick={() => navigate(`/workspace/${workspaceId}/videoRoom`)}
          className="w-full py-6 text-base font-semibold bg-emerald-600 hover:bg-emerald-500 text-white"
        >
          <Video className="size-5 mr-2" />
          Join Meeting Now
        </Button>
      </div>
    </div>
  )
}

export default MeetingInvitePage