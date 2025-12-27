import MessageRenderer from '@/atoms/messageRenderer/MessageRenderer'
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Avatar } from '@radix-ui/react-avatar'

const Message = ({
  authorImage,
  authorName,
  createdAt,
  body,
}: {
  authorImage: string
  authorName: string
  createdAt: any
  body: any
}) => {
  return (
    <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-blue-900/60 group relative">
      <div className="flex items-start gap-4">
        <button>
          <Avatar>
            <AvatarImage className="rounded-full size-8 hover:opacity-60 transition-opacity border-2 border-[var(--primary-end)]" src={authorImage} />
            <AvatarFallback className="rounded-md bg-sky-600 text-slate-100 text-sm">
              {authorName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
        <div className="flex flex-col w-full overflow-hidden">
          <div className="text-sm text-blue-300 ">
            <button className="font-bold hover:underline">{authorName}</button>
            <span>&nbsp;&nbsp;</span>
            <button className="text-sm text-slate-400 hover:underline">{createdAt}</button>
          </div>
          <MessageRenderer value={body} />
        </div>
      </div>
    </div>
  )
}

export default Message
