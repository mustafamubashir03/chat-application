import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { createInvitation } from '@/apis/invitation'
import { useAuth } from '@/hooks/context/useAuth'
import { useResetJoinCode } from '@/hooks/apis/workspace/useResetJoinCode'
import { useCurrentWorkspace } from '@/hooks/context/useCurrentWorkspace'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowRight, CopyIcon, LinkIcon, Redo2Icon, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

const WorkspaceInviteModal = ({
  openInviteModal,
  setOpenInviteModal,
  workspaceName,
  joinCode,
}: {
  openInviteModal: boolean
  setOpenInviteModal: any
  workspaceName: string
  joinCode: string
}) => {
  const { auth } = useAuth()
  const [generating, setGenerating] = useState(false)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { currentWorkspace } = useCurrentWorkspace()
  const { workspaceId } = useParams()
  const { resetJoinCodeMutatation } = useResetJoinCode({ workspaceId: workspaceId || '' })

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(joinCode || currentWorkspace?.joinCode)
    toast.success('Join Code copied to clipboard.')
  }

  const handleGenerateAndCopyLink = async () => {
    const wsId = workspaceId || currentWorkspace?._id
    if (!wsId || !auth?.token) return
    try {
      setGenerating(true)
      const res = await createInvitation({ workspaceId: wsId, token: auth.token })
      const token = res?.data?.token
      if (token) {
        const inviteUrl = `${window.location.origin}/invite/${token}`
        await navigator.clipboard.writeText(inviteUrl)
        toast.success('Single invitation link copied to clipboard!')
      }
    } catch (e: any) {
      toast.error(e?.message || 'Failed to generate invitation link')
    } finally {
      setGenerating(false)
    }
  }

  const handleResetJoinCode = async () => {
    await resetJoinCodeMutatation()
    await queryClient.invalidateQueries({ queryKey: ['getWorkspace'] })
    await queryClient.invalidateQueries({ queryKey: [`getWorkspaceDetails-${workspaceId}`] })
    setOpenInviteModal(false)
    navigate(`/workspace/${workspaceId}`)
  }

  return (
    <Dialog open={openInviteModal} onOpenChange={setOpenInviteModal}>
      <DialogContent className="bg-gradient-to-r from-[#0e111e] via-[#121526] to-[#121423] border-slate-600">
        <DialogHeader>
          <DialogTitle className="text-slate-300 mb-2 text-center">
            Invite a new member to {workspaceName}
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-center">
            Share a direct invitation link or use the workspace join code below.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-4 gap-3 text-slate-400">
          <Button
            size="lg"
            variant="darkBlue"
            onClick={handleGenerateAndCopyLink}
            disabled={generating}
            className="w-full font-semibold flex items-center justify-center gap-2"
          >
            {generating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <LinkIcon className="size-4" />
            )}
            Copy Single Invitation Link
          </Button>

          <div className="w-full border-t border-slate-800 my-2" />

          <p className="text-xs text-slate-400 uppercase tracking-wider">Fallback Join Code</p>
          <p className="text-2xl text-blue-300 uppercase font-bold tracking-widest">
            {joinCode || currentWorkspace?.joinCode}
          </p>
          <Button size="sm" variant="outline" onClick={handleCopyCode}>
            <CopyIcon className="size-4 mr-2" />
            Copy Join Code
          </Button>
          <Button
            className="mt-2"
            size="sm"
            variant="transparent"
            onClick={() => {
              navigate(`/workspace/join/${currentWorkspace?._id || workspaceId}`)
            }}
          >
            <ArrowRight className="size-4 mr-2 text-slate-400" />
            Redirect to manual code page
          </Button>
          <Button className="mt-4" size="sm" variant="indigoGlow" onClick={handleResetJoinCode}>
            <Redo2Icon className="size-4 mr-2" />
            Reset Join Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default WorkspaceInviteModal
