import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useResetJoinCode } from '@/hooks/apis/workspace/useResetJoinCode'
import { useCurrentWorkspace } from '@/hooks/context/useCurrentWorkspace'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowRight, CopyIcon, Redo2Icon } from 'lucide-react'
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
  const handleCopy = async () => {
    await navigator.clipboard.writeText(joinCode)
    toast.success('Invite Link copied to clipboard.')
  }
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { currentWorkspace } = useCurrentWorkspace()
  const {workspaceId} = useParams()
  const {resetJoinCodeMutatation} = useResetJoinCode({workspaceId:workspaceId ||""})
  const handleResetJoinCode = async()=>{
    await resetJoinCodeMutatation()
    await queryClient.invalidateQueries({ queryKey: ['getWorkspace'] })
    await queryClient.invalidateQueries({ queryKey: [`getWorkspaceDetails-${workspaceId}`] })
    setOpenInviteModal(false)
    navigate(`/workspace/${workspaceId}`)
  }
  console.log("current workspace state",currentWorkspace)

  return (
    <Dialog open={openInviteModal} onOpenChange={setOpenInviteModal}>
      <DialogContent className="bg-gradient-to-r from-[#0e111e] via-[#121526] to-[#121423] border-slate-600">
        <DialogHeader>
          <DialogTitle className="text-slate-300 mb-2 text-center">
            Invite a new member to {workspaceName}
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-center"> 
            Use the code below to invite a new member to {workspaceName}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-4 gap-2 text-slate-400">
          <p className="text-xl text-blue-300 uppercase font-semibold">{currentWorkspace?.joinCode}</p>
          <Button size={'sm'} variant={'BlueDark'} onClick={handleCopy}>
            <CopyIcon className="size-4 ml-2" />
            Copy Invite Code
          </Button>
          <Button
            className="mt-2"
            size={'sm'}
            variant={'darkBlue'}
            onClick={() => {
              navigate(`/workspace/join/${currentWorkspace._id}`)
            }}
          >
            <ArrowRight className="size-4 ml-2" />
            Redirect to join page
          </Button>
          <Button className="mt-6" size={'sm'} variant={'indigoGlow'} onClick={handleResetJoinCode}>
            <Redo2Icon className="size-4 ml-2" />
            Reset Join Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default WorkspaceInviteModal
