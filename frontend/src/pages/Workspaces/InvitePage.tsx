import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/context/useAuth'
import { acceptInvitation, getInvitationByToken } from '@/apis/invitation'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

const InvitePage = () => {
  const { inviteToken } = useParams<{ inviteToken: string }>()
  const { auth } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [invitationData, setInvitationData] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!auth?.token) {
      navigate('/auth/signin', { state: { from: location } })
      return
    }

    if (!inviteToken) return

    const fetchDetails = async () => {
      try {
        setLoading(true)
        const response = await getInvitationByToken({
          inviteToken,
          token: auth.token || '',
        })
        setInvitationData(response?.data)
      } catch (err: any) {
        setErrorMsg(err?.message ? String(err.message) : 'Invalid or expired invitation link.')
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [inviteToken, auth?.token])

  const handleAccept = async () => {
    if (!inviteToken || !auth?.token) return
    try {
      setJoining(true)
      const res = await acceptInvitation({
        inviteToken,
        token: auth.token,
      })
      const workspaceId = res?.data?._id || invitationData?.invitation?.workspaceId?._id
      if (workspaceId) {
        navigate(`/workspace/${workspaceId}`)
      } else {
        navigate('/home')
      }
    } catch (err: any) {
      setErrorMsg(err?.message ? String(err.message) : 'Failed to join workspace.')
    } finally {
      setJoining(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200 p-4">
        <Loader2 className="animate-spin size-8 text-blue-400 mb-4" />
        <p className="text-slate-400 text-sm">Validating workspace invitation...</p>
      </div>
    )
  }

  if (errorMsg || !invitationData?.isValid) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200 p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-6 text-center shadow-xl">
          <AlertCircle className="size-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-100 mb-2">Invitation Unavailable</h2>
          <p className="text-slate-400 text-sm mb-6">{errorMsg || 'This invitation has expired or is no longer valid.'}</p>
          <Button onClick={() => navigate('/home')} variant="outline" className="w-full">
            Back to Workspace Home
          </Button>
        </div>
      </div>
    )
  }

  const workspace = invitationData?.invitation?.workspaceId
  const inviter = invitationData?.invitation?.createdBy

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200 p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl text-center">
        <div className="size-14 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="size-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-100 mb-2">You've been invited!</h1>
        <p className="text-slate-400 text-sm mb-6">
          {inviter?.username || 'Someone'} has invited you to join the workspace <strong className="text-slate-200">{workspace?.name || 'a workspace'}</strong>.
        </p>

        {workspace?.description && (
          <div className="bg-slate-950/60 rounded-lg p-3 text-xs text-slate-400 border border-slate-800/80 mb-6">
            {workspace.description}
          </div>
        )}

        <Button
          onClick={handleAccept}
          disabled={joining}
          variant="darkBlue"
          className="w-full py-6 text-base font-semibold"
        >
          {joining ? (
            <>
              <Loader2 className="animate-spin size-5 mr-2" /> Joining Workspace...
            </>
          ) : (
            'Accept Invitation & Join'
          )}
        </Button>
      </div>
    </div>
  )
}

export default InvitePage
