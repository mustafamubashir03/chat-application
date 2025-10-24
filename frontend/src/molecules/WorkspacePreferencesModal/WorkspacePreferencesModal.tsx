import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useDeleteWorkspace } from '@/hooks/apis/workspace/useDeleteWorkspace'
import { useUpdateWorkspace } from '@/hooks/apis/workspace/useUpdateWorkspace'
import { useConfirm } from '@/hooks/context/useConfirm'
import { useWorkspacePreferences } from '@/hooks/context/useWorkspacePreferences'
import { DialogClose } from '@radix-ui/react-dialog'
import { useQueryClient } from '@tanstack/react-query'
import { Edit2Icon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const WorkspacePreferencesModal = () => {
  const { initialValue, openPreferences, setOpenPreferences } = useWorkspacePreferences()
  const {Confirmation,ConfirmDialog} = useConfirm({title:"Are you sure that you want to delete the workspace?",message:"This action cannot be undone"})
  const {Confirmation:updateConfirmation,ConfirmDialog:UpdateConfirmDialog} = useConfirm({title:"Are you sure that you want to update the name of the workspace?",message:"This action cannot be undone"})
  const [editOpen, setEditOpen] = useState(false)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [renameValue, setRenameValue] = useState(initialValue)
  const { workspaceId } = useParams()
  const { updateWorkspaceDetailsMutation,isPending } = useUpdateWorkspace({
    workspaceId: workspaceId || '',
    name: renameValue || '',
  })
  const { deleteWorkspaceMutation } = useDeleteWorkspace({ workspaceId: workspaceId || '' })
  const handleDeleteWorkspace = async () => {
    try {
      const ok = await Confirmation()
      if(!ok){
        return
      }
      await deleteWorkspaceMutation()
      setOpenPreferences(false)
      await queryClient.invalidateQueries({ queryKey: ['getWorkspace'] })
      navigate('/home')
    } catch (error) {
      console.log(error)
    }
  }
  const handleUpdateFormSubmit = async (e: any) => {
    e.preventDefault()
    if (!renameValue) {
      return
    }
    const ok = await updateConfirmation()
    if(!ok){
      return
    }
    await updateWorkspaceDetailsMutation()
    setEditOpen(false)
    setOpenPreferences(false)
    await queryClient.invalidateQueries({ queryKey: [`getWorkspaceDetails-${workspaceId}`] })
    navigate(`/workspace/${workspaceId}`)
  }
  return (
    <>
    <UpdateConfirmDialog/>
     <ConfirmDialog/>
    <Dialog open={openPreferences} onOpenChange={setOpenPreferences}>
      <DialogContent className="bg-gradient-to-r rounded-md from-[#0e111e] via-[#121526] to-[#121423] border-slate-600 z-10">
        <DialogHeader>
          <DialogTitle className="text-slate-300 mb-2">Edit Workspace</DialogTitle>
        </DialogHeader>
        <div className="flex  flex-col gap-4 w-full">
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger className="flex flex-col justify-start">
              <div className="flex flex-col px-5 py-4 bg-slate-800 rounded-lg w-full cursor-pointer hover:bg-blue-800/30">
                <div className="flex items-start justify-between w-full text-slate-400">
                  <p className="font font-semibold text-sm">Workspace name</p>
                  <p className="text-sm gap-2 flex font-semibold hover:underline"><Edit2Icon className='w-4'/>Edit</p>
                </div>
                <p className="text-blue-400 text-start text-sm">{initialValue}</p>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="text-slate-400">
                <DialogTitle>Rename Workspace</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateFormSubmit} className="space-y-4 text-slate-400">
                <Input
                  minLength={3}
                  maxLength={50}
                  required
                  disabled={isPending}
                  autoFocus
                  placeholder="Workspace name e.g: Design Team"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                />
              <DialogFooter>
                <DialogClose className='w-full flex justify-end'>
                    <Button className='outline-slate-400 text-slate-400 ' disabled={isPending} variant={'outline'}>Cancel</Button>
                </DialogClose>
                    <Button type='submit'  disabled={isPending} variant={'primary'}>Save</Button>
              </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Button onClick={handleDeleteWorkspace} variant={'delete'}>
            <Trash2Icon />
            <p>Delete Workspace</p>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}

export default WorkspacePreferencesModal
