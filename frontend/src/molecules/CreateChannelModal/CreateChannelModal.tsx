import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import useCreateChannelModal from '@/hooks/apis/channel/useCreateChannelModal'
import { useAddChannelToWorkspace } from '@/hooks/apis/workspace/useAddChannelToWorkspace'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

const CreateChannelModal = () => {
  const { openCreateChannelModal, setOpenCreateChannelModal } = useCreateChannelModal()
  const [channelName, setChannelName] = useState('')
  const { workspaceId } = useParams()
  console.log('workspaceId', workspaceId)
  const queryClient = useQueryClient()
  const { addChannelToWorkspaceMutation, isPending } = useAddChannelToWorkspace({
    workspaceId: workspaceId || '',
    channelName,
  })
  const handleClose = () => {
    setOpenCreateChannelModal(false)
  }
  const handleChannelFormSubmit = async (e: any) => {
    try {
      e.preventDefault()
      if (!channelName) {
        return
      }
      await addChannelToWorkspaceMutation()
      await queryClient.invalidateQueries({ queryKey: ['getWorkspace'] })
      await queryClient.invalidateQueries({ queryKey: [`getWorkspaceDetails-${workspaceId}`] })
      setOpenCreateChannelModal(false)
    } catch (e) {
      console.log(e)
    } finally {
      setChannelName('')
      setOpenCreateChannelModal(false)
    }
  }
  return (
    <Dialog open={openCreateChannelModal} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-800 border-slate-600">
        <DialogHeader>
          <DialogTitle className="text-slate-300 mb-2">Create a new Channel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleChannelFormSubmit}>
          <Input
            required={true}
            minLength={3}
            placeholder="Enter channel name e.g: job-announcements"
            disabled={isPending}
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            className="bg-[#212435] border border-neutral-700
          px-3 py-2 text-sm text-slate-300 
          placeholder-neutral-500 
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 
          disabled:cursor-not-allowed disabled:opacity-50 mb-4"
          />

          <div className="flex justify-center mt-5">
            <Button
              variant={'primary'}
              size={'lg'}
              type="submit"
              className="w-full"
              disabled={isPending}
            >
              Create Channel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateChannelModal
