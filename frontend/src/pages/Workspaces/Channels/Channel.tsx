import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { LucideLoader2 } from 'lucide-react'

import useGetChannelWithWorkspaceDetails from '@/hooks/apis/channel/useGetChannelWithWorkspaceDetails'
import { useGetMessagesByChannelId } from '@/hooks/apis/channel/useGetMessagesByChannelId'
import useSocket from '@/hooks/context/useSocket'
import { useAuth } from '@/hooks/context/useAuth'
import useQueuedNewMessageSender from '@/hooks/useQueuedNewMessageSender'

import ChatInput from '@/molecules/ChatInput/ChatInput'
import Message from '@/molecules/Message/Message'
import type { AudioAttachment, ChatMessage } from '@/types/message'
import { senderAvatarOf, senderNameOf } from '@/utils/message'

const PAGE_SIZE = 60

const byCreatedAt = (a: ChatMessage, b: ChatMessage) =>
  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()

const Channel = () => {
  const { workspaceId, channelId } = useParams<{ workspaceId: string; channelId: string }>()

  const bottomRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const prevHeightRef = useRef(0)

  const { joinChannel, leaveChannel, newMessageRecieved, socket } = useSocket()
  const { auth } = useAuth()
  const sendNewMessage = useQueuedNewMessageSender(socket)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [page, setPage] = useState(1)

  /* ---------------- CHANNEL DETAILS ---------------- */
  const {
    channelWithWorkspaceDetails,
    isFetching: isChannelFetching,
    isError,
  } = useGetChannelWithWorkspaceDetails({
    channelId: channelId || '',
  })

  /* ---------------- DB MESSAGES (paged) ---------------- */
  const {
    messagesByChannelId,
    isFetching: isMessagesFetching,
    isSuccess,
    error: messagesError,
  } = useGetMessagesByChannelId({
    channelId: channelId || '',
    page,
  })

  const hasMore =
    isSuccess && Array.isArray(messagesByChannelId) && messagesByChannelId.length === PAGE_SIZE

  const loadMore = () => {
    const el = listRef.current
    if (el) prevHeightRef.current = el.scrollHeight
    setPage((p) => p + 1)
  }

  /* ---------------- RESET ON CHANNEL CHANGE ---------------- */
  useEffect(() => {
    setMessages([])
    setPage(1)
    prevHeightRef.current = 0
  }, [channelId])

  /* ---------------- JOIN / LEAVE SOCKET CHANNEL ---------------- */
  useEffect(() => {
    if (!channelId || isChannelFetching || isError) return

    joinChannel(channelId)

    return () => {
      leaveChannel(channelId)
    }
  }, [channelId, isChannelFetching, isError, joinChannel, leaveChannel])

  /* ---------------- MERGE DB MESSAGES ---------------- */
  useEffect(() => {
    if (!Array.isArray(messagesByChannelId) || messagesByChannelId.length === 0) return

    setMessages((prev) => {
      const known = new Set(prev.map((m) => m._id))
      const additions = (messagesByChannelId as ChatMessage[]).filter(
        (m) => !known.has(m._id),
      )
      return [...additions, ...prev].sort(byCreatedAt)
    })
  }, [messagesByChannelId, page])

  /* ---------------- PRESERVE SCROLL WHILE LOADING OLDER MESSAGES ---------------- */
  useEffect(() => {
    if (page <= 1) return
    const el = listRef.current
    if (el && prevHeightRef.current) {
      el.scrollTop += el.scrollHeight - prevHeightRef.current
    }
  }, [page, messagesByChannelId])

  /* ---------------- SOCKET MESSAGE ---------------- */
  useEffect(() => {
    if (!newMessageRecieved?._id) return
    if (newMessageRecieved.channelId !== channelId) return

    setMessages((prev) => {
      const exists = prev.some((m) => m._id === newMessageRecieved._id)
      if (exists) return prev
      return [...prev, newMessageRecieved]
    })

    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [newMessageRecieved, channelId])

  /* ---------------- SCROLL TO BOTTOM ON INITIAL LOAD ---------------- */
  useEffect(() => {
    if (page === 1 && messages.length > 0 && !isMessagesFetching) {
      bottomRef.current?.scrollIntoView()
    }
  }, [page, messages, isMessagesFetching])

  /* ---------------- SEND MESSAGE ---------------- */
  const handleSend = (content: string, image?: string, audio?: AudioAttachment) => {
    if (!channelId || !auth?.user?.id) return
    if (!content.trim() && !image && !audio) return

    sendNewMessage({
      channelId,
      workspaceId,
      senderId: auth.user.id,
      messageBody: content,
      messageType: audio ? 'audio' : image ? 'image' : 'text',
      mediaUrl: audio ? audio.url : image || undefined,
      mediaPublicId: audio?.publicId,
      mediaMimeType: audio?.mimeType,
      mediaDuration: audio?.duration,
      image: image || undefined,
      audio: audio?.url,
    })
  }

  /* ---------------- RENDER ---------------- */
  return (
    <div className="flex flex-col h-full min-h-0 bg-background">
      {/* Header */}
      <div className="shrink-0 px-4 py-3 border-b border-slate-500/30 text-slate-300 font-semibold text-lg truncate">
        #{channelWithWorkspaceDetails?.name}
      </div>

      {/* Messages */}
      <div ref={listRef} className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-4 chat-scroll">
        {(isChannelFetching || (isMessagesFetching && page === 1 && messages.length === 0)) && (
          <div className="flex justify-center py-4">
            <LucideLoader2 className="animate-spin size-6 text-slate-400" />
          </div>
        )}

        {isError && <p className="text-center text-slate-400">Couldn't fetch messages</p>}

        {messagesError && !isMessagesFetching && (
          <p className="text-center text-sm text-red-400 py-4">
            {messagesError?.message || "Couldn't load messages"}
          </p>
        )}

        {hasMore && (
          <div className="flex justify-center py-2">
            <button
              type="button"
              onClick={loadMore}
              disabled={isMessagesFetching}
              className="text-xs text-blue-400 hover:text-blue-300 disabled:opacity-60 px-3 py-1 rounded-full border border-blue-800/40 bg-blue-950/30"
            >
              {isMessagesFetching ? 'Loading earlier messages...' : 'Load earlier messages'}
            </button>
          </div>
        )}

        {messages.map((message) => (
          <Message
            key={message._id}
            authorImage={senderAvatarOf(message.senderId)}
            authorName={senderNameOf(message.senderId)}
            image={message.image || ''}
            audio={message.mediaUrl || message.audio || undefined}
            messageType={message.messageType}
            body={message.messageBody}
            createdAt={new Date(message.createdAt).toLocaleString()}
          />
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div className="shrink-0 border-t border-slate-500/30 bg-background/80 backdrop-blur px-2 sm:px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <ChatInput placeholder="Type a message..." onSend={handleSend} />
      </div>
    </div>
  )
}

export default Channel