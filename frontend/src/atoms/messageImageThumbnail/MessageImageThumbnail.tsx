import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"


const MessageImageThumbnail = ({imageURL}:{imageURL:string}) => {
  return (
    <Dialog>
        <DialogTrigger>
            <div className="relative overflow-hidden cursor-zoom-in border rounded-lg max-w-[370px]">
                <img src={imageURL} alt="Message Image Thumbnail" className="rounded-md size-full object-cover" />

            </div>
        </DialogTrigger>
        <DialogContent className="max-w-[850px] border-none p-0 shadow-none bg-gradient-to-r from-[#0e111e] via-[#121526] to-[#121423] border border-slate-600 rounded-md">
            <img src={imageURL} alt="Message Image" className="rounded-md size-full object-cover" />
        </DialogContent>
    </Dialog>
  )
}

export default MessageImageThumbnail