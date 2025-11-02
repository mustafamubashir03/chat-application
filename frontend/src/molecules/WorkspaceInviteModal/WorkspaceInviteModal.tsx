import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CopyIcon } from "lucide-react"
import { toast } from "sonner"


const WorkspaceInviteModal = ({openInviteModal,setOpenInviteModal,workspaceName,joinCode}:{openInviteModal:boolean,setOpenInviteModal:any,workspaceName:string,joinCode:string}) => {
  const handleCopy = async()=>{
    const inviteCode = `${window.location.origin}/join/${joinCode}`
    await navigator.clipboard.writeText(inviteCode)
    toast.success("Invite Link copied to clipboard.")
  }

  return (
    <Dialog open={openInviteModal} onOpenChange={setOpenInviteModal}>
    <DialogContent className="bg-gradient-to-r from-[#0e111e] via-[#121526] to-[#121423] border-slate-600">
      <DialogHeader>
        <DialogTitle className="text-slate-300 mb-2 text-center">Invite a new member to {workspaceName}</DialogTitle>
        <DialogDescription className="text-slate-400 text-center">Use the code below to invite a new member to {workspaceName}</DialogDescription>
      </DialogHeader>
      <div className="flex flex-col items-center justify-center py-4 gap-2 text-slate-400">
      <p className="text-xl text-blue-300 uppercase font-semibold">{joinCode}</p>
      <Button size={"sm"} variant={"BlueDark"} onClick={handleCopy}>
        <CopyIcon className="size-4 ml-2"/>
        Copy Invite Link
      </Button>

      </div>
    </DialogContent>
  </Dialog>
  )
}

export default WorkspaceInviteModal