import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from "@/components/ui/button"

type ConfirmOptions = {
  title: string
  message: string
}

export const useConfirm = ({ title, message }: ConfirmOptions) => {
  const [promise, setPromise] = useState(null)
  async function Confirmation(){
    return new Promise((resolve)=>{
      setPromise(()=>({resolve}))
    })
  }
  const handleClose =()=>{
    setPromise(null)
  }
  const  handleConfirm = ()=>{
    promise?.resolve(true)
    handleClose()
  }


  const ConfirmDialog = () => (
    <Dialog open={promise !== null}>
      <DialogContent className="bg-gradient-to-r from-[#0e111e] via-[#121526] to-[#121423] border border-slate-600 rounded-md">
        <DialogHeader>
          <DialogTitle className="text-blue-300 text-sm">{title}</DialogTitle>
          <DialogDescription className="text-slate-400">{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant={"secondary"} onClick={handleClose}>Cancel</Button>
          <Button variant={"primary"} onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return { Confirmation, ConfirmDialog }
}
