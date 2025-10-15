import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import useCreateChannelModal from "@/hooks/apis/channel/useCreateChannelModal"
import { useState } from "react"

const CreateChannelModal = () => {
    const {openCreateChannelModal,setOpenCreateChannelModal} = useCreateChannelModal()
    const [channelName,setChannelName] = useState("")
    const handleClose = ()=>{
        setOpenCreateChannelModal(false)
    }
    const handleChannelFormSubmit = (e:any)=>{
        e.preventDefault()

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