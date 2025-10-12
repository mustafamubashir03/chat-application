import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useDeleteWorkspace } from '@/hooks/apis/workspace/useDeleteWorkspace'
import { useWorkspacePreferences } from '@/hooks/context/useWorkspacePreferences'
import { useQueryClient } from '@tanstack/react-query'
import { Trash2Icon } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

const WorkspacePreferencesModal = () => {
  const { initialValue, openPreferences, setOpenPreferences } = useWorkspacePreferences()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { workspaceId } = useParams()
  const { deleteWorkspaceMutation } = useDeleteWorkspace({ workspaceId: workspaceId || '' })
  const handleDeleteWorkspace = async () => {
    try {
      await deleteWorkspaceMutation()
      setOpenPreferences(false)
      queryClient.invalidateQueries({ queryKey: ['getWorkspace'] })
      navigate('/home')
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Dialog open={openPreferences} onOpenChange={setOpenPreferences}>
      <DialogContent className="bg-gradient-to-r rounded-md from-[#0e111e] via-[#121526] to-[#121423] border-slate-600">
        <DialogHeader>
          <DialogTitle className="text-slate-300 mb-2">Edit Workspace</DialogTitle>
        </DialogHeader>
        <div className="flex  flex-col gap-4 w-full">
          <div className="flex flex-col px-5 py-4 bg-slate-800 rounded-lg w-full cursor-pointer hover:bg-blue-800/30">
            <div className="flex items-center justify-between w-full text-slate-400">
              <p className="font font-semibold text-sm">Workspace name</p>
              <p className="text-sm font-semibold hover:underline">Edit</p>
            </div>
            <p className="text-blue-400 text-sm">{initialValue}</p>
          </div>
          <Button onClick={handleDeleteWorkspace} variant={'delete'}>
            <Trash2Icon />
            <p>Delete Workspace</p>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default WorkspacePreferencesModal
