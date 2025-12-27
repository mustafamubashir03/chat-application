import useGetChannelWithWorkspaceDetails from '@/hooks/apis/channel/useGetChannelWithWorkspaceDetails'
import { LucideLoader2 } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import QuillEditor from '@/components/ui/quill-editor'
import useSocket from '@/hooks/context/useSocket'
import { useGetMessagesByChannelId } from '@/hooks/apis/channel/useGetMessagesByChannelId'
import Message from '@/molecules/Message/Message'

const Channel = () => {
  const { channelId } = useParams()
  const { channelWithWorkspaceDetails, isFetching, isError } = useGetChannelWithWorkspaceDetails({
    channelId: channelId || '',
  })
  const [editorValue, setEditorValue] = useState({})
  const { joinChannel } = useSocket()
  const { messagesByChannelId } = useGetMessagesByChannelId({ channelId: channelId || '' })
  const containerRef = useRef<HTMLDivElement>(null)
const bottomRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  const container = containerRef.current
  if (!container) return

  const isNearBottom =
    container.scrollHeight - container.scrollTop - container.clientHeight < 120

  if (isNearBottom) {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
}, [messagesByChannelId])

useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: 'auto' })
}, [])


const sortedMessages = useMemo(
  () =>
    [...(messagesByChannelId ?? [])].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    ),
  [messagesByChannelId]
)

  
  useEffect(() => {
    if (!isFetching && !isError) {
      joinChannel(channelId || '')

    }
  }, [isFetching, isError, channelId])

  return (
    <div className="flex flex-1 overflow-hidden flex-col h-screen bg-background">
      {/* Header */}
      <div className="shrink-0 text-slate-300 font-semibold text-lg px-4 py-3 mt-8 border-b border-slate-500/30">
        #{channelWithWorkspaceDetails?.name}
      </div>
  
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {isFetching && (
          <div className="flex justify-center py-4">
            <LucideLoader2 className="animate-spin size-6 text-slate-400" />
          </div>
        )}
  
        {isError && (
          <p className="text-slate-400 text-center">
            Couldn't fetch messages
          </p>
        )}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-4 chat-scroll"
      >
        {sortedMessages.map((message: any) => (
          <Message
            key={message._id}
            authorImage={message.senderId.avatar}
            authorName={message.senderId.username}
            createdAt={new Date(message.createdAt).toLocaleString('en-US', {
              day: '2-digit',
              month: 'short',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })}
            body={message.messageBody}
          />
        ))}

        <div ref={bottomRef} />
      </div>

      </div>
  
      {/* Editor */}
      <div className="shrink-0 border-t border-slate-500/30 bg-background/80 backdrop-blur px-4 py-3">
        <QuillEditor
          value={editorValue}
          onChange={setEditorValue}
          placeholder="Type a message..."
          className="chat-editor"
        />
      </div>
    </div>
  )
  
}

export default Channel
