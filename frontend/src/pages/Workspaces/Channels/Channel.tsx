import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { LucideLoader2 } from 'lucide-react'

import useGetChannelWithWorkspaceDetails from '@/hooks/apis/channel/useGetChannelWithWorkspaceDetails'
import { useGetMessagesByChannelId } from '@/hooks/apis/channel/useGetMessagesByChannelId'
import useSocket from '@/hooks/context/useSocket'

import Message from '@/molecules/Message/Message'
import QuillEditor from '@/components/ui/quill-editor'

const Channel = () => {
  const { channelId } = useParams<{ channelId: string }>()

  const bottomRef = useRef<HTMLDivElement>(null)

  const { joinChannel, leaveChannel, newMessageRecieved } = useSocket()

  const [messages, setMessages] = useState<any[]>([])
  const [editorValue, setEditorValue] = useState({})

  /* ---------------- CHANNEL DETAILS ---------------- */
  const {
    channelWithWorkspaceDetails,
    isFetching: isChannelFetching,
    isError,
  } = useGetChannelWithWorkspaceDetails({
    channelId: channelId || '',
  })

  /* ---------------- DB MESSAGES ---------------- */
  const {
    messagesByChannelId,
    isFetching: isMessagesFetching,
  } = useGetMessagesByChannelId({
    channelId: channelId || '',
  })

  /* ---------------- RESET ON CHANNEL CHANGE ---------------- */
  useEffect(() => {
    setMessages([])
  }, [channelId])

  /* ---------------- JOIN / LEAVE SOCKET CHANNEL ---------------- */
  useEffect(() => {
    if (!channelId || isChannelFetching || isError) return

    joinChannel(channelId)

    return () => {
      leaveChannel?.(channelId)
    }
  }, [channelId, isChannelFetching, isError, joinChannel, leaveChannel])

  /* ---------------- LOAD DB MESSAGES ---------------- */
  useEffect(() => {
    if (!messagesByChannelId) return

    setMessages(
      [...messagesByChannelId].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      )
    )
  }, [messagesByChannelId])

  /* ---------------- SOCKET MESSAGE ---------------- */
  useEffect(() => {
    if (!newMessageRecieved?._id) return
    if (newMessageRecieved.channelId !== channelId) return

    setMessages((prev) => {
      const exists = prev.some(m => m._id === newMessageRecieved._id)
      if (exists) return prev
      return [...prev, newMessageRecieved]
    })
  }, [newMessageRecieved, channelId])

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  /* ---------------- RENDER ---------------- */
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="shrink-0 px-4 py-3 mt-8 border-b border-slate-500/30 text-slate-300 font-semibold text-lg">
        #{channelWithWorkspaceDetails?.name}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 chat-scroll">
        {(isChannelFetching || isMessagesFetching) && (
          <div className="flex justify-center py-4">
            <LucideLoader2 className="animate-spin size-6 text-slate-400" />
          </div>
        )}

        {isError && (
          <p className="text-center text-slate-400">
            Couldn't fetch messages
          </p>
        )}

        {messages.map((message) => (
          <Message
            key={message._id}
            authorImage={message.senderId?.avatar}
            authorName={message.senderId?.username}
            image={message.image || ''}
            body={message.messageBody}
            createdAt={new Date(message.createdAt).toLocaleString()}
          />
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Editor */}
      <div className="shrink-0 border-t border-slate-500/30 bg-background/80 backdrop-blur px-4 py-3">
        <QuillEditor
          value={editorValue}
          onChange={setEditorValue}
          placeholder="Type a message..."
        />
      </div>
    </div>
  )
}

export default Channel
