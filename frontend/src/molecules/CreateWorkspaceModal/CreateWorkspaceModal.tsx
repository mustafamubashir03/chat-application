import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import useCreateWorkspace from '@/hooks/apis/workspace/useCreateWorkspace'
import { useCreateWorkspaceModal } from '@/hooks/apis/workspace/useCreateWorkspaceModal'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CreateWorkspaceModal = () => {
  const { openCreateWorkspaceModal, setOpenCreateWorkspaceModal } = useCreateWorkspaceModal()
  const navigate = useNavigate()
  const { isPending, createWorkspaceMutation } = useCreateWorkspace()
  const [workspaceName, setWorkspaceName] = useState('')
  const [workspaceDescription, setWorkspaceDescription] = useState('')
  const handleClose = () => {
    setOpenCreateWorkspaceModal(false)
  }
  const handleWorkspaceFormSubmit = async (e: any) => {
    try {
      e.preventDefault()
      if (!workspaceName) {
        return
      }
      const data = await createWorkspaceMutation({
        name: workspaceName,
        description: workspaceDescription,
      })
      console.log(data)
      navigate(`/workspace/${data._id}`)
      setOpenCreateWorkspaceModal(false)
    } catch (error) {
      console.log(error)
    } finally {
      setOpenCreateWorkspaceModal(false)
      setWorkspaceName('')
      setWorkspaceDescription('')
    }
  }
  return (
    <Dialog open={openCreateWorkspaceModal} onOpenChange={handleClose}>
      <DialogContent className="bg-gradient-to-r from-[#0e111e] via-[#121526] to-[#121423] border-slate-600">
        <DialogHeader>
          <DialogTitle className="text-slate-300 mb-2">Create a new Workspace</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleWorkspaceFormSubmit}>
          <Input
            required={true}
            minLength={3}
            disabled={isPending}
            placeholder="Enter workspace name e.g: MyWorkspace, Dev Workspace"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            className="bg-[#212435] border border-neutral-700
            px-3 py-2 text-sm text-slate-300 
            placeholder-neutral-500 
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 
            disabled:cursor-not-allowed disabled:opacity-50 mb-4"
          />
          <Input
            minLength={4}
            placeholder="Enter workspace description e.g: This workspace is for news discussion"
            value={workspaceDescription}
            disabled={isPending}
            onChange={(e) => setWorkspaceDescription(e.target.value)}
            className="bg-[#212435] border border-neutral-700
            px-3 py-2 text-sm text-slate-300 
            placeholder-neutral-500 
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 
            disabled:cursor-not-allowed disabled:opacity-50 mb-4"
          />
          <div className="flex justify-center mt-5">
            <Button
              disabled={isPending}
              variant={'primary'}
              size={'lg'}
              type="submit"
              className="w-full"
            >
              Create Workspace
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateWorkspaceModal
