import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { LucideLoader2 } from 'lucide-react'

import useSocket from '@/hooks/context/useSocket'
import { useAuth } from '@/hooks/context/useAuth'
import useQueuedNewMessageSender from '@/hooks/useQueuedNewMessageSender'
import { useGetWorkspaceById } from '@/hooks/apis/workspace/useGetWorkspaceById'
import { getMessagesByChannelId } from '@/apis/channel'

import ChatInput from '@/molecules/ChatInput/ChatInput'
import Message from '@/molecules/Message/Message'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { AudioAttachment, ChatMessage, ChatMessageSender } from '@/types/message'
import { senderAvatarOf, senderIdOf, senderNameOf } from '@/utils/message'

const PAGE_SIZE = 60

const byCreatedAt = (a: ChatMessage, b: ChatMessage) =>
  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()

/**
 * DirectMessagePage
 *
 * Private 1‑on‑1 chat between the logged‑in user and the workspace member
 * whose id appears in the URL as `:memberId`.
 *
 * The DM room id is the two sorted userId strings joined with "_",
 * which is deterministic so both participants always land in the same room.
 */
const DirectMessagePage = () => {
  const { workspaceId, memberId } = useParams<{ workspaceId: string; memberId: string }>()
  const { auth } = useAuth()
  const bottomRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const prevHeightRef = useRef(0)

  const { joinChannel, leaveChannel, newMessageRecieved, socket } = useSocket()
  const { workspaceDetails } = useGetWorkspaceById({ workspaceId: workspaceId || '' })
  const sendNewMessage = useQueuedNewMessageSender(socket)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [prependTag, setPrependTag] = useState(0)

  // Deterministic DM room id – sorted so both users get the same id.
  // A DM with yourself is not allowed, so no room is ever formed for it.
  const dmRoomId = useMemo(() => {
    if (!auth?.user?.id || !memberId) return null
    if (memberId === auth.user.id) return null
    return [auth.user.id, memberId].sort().join('_')
  }, [auth?.user?.id, memberId])

  // Find the other member's profile from workspace members list
  const otherMember = useMemo(() => {
    if (!workspaceDetails?.members || !memberId) return null
    return workspaceDetails.members.find((m: unknown) => {
      const member = m as { memberId?: ChatMessageSender | string }
      return senderIdOf(member?.memberId) === memberId
    })?.memberId as ChatMessageSender | undefined
  }, [workspaceDetails, memberId])

  const otherUsername = otherMember?.username || 'Member'
  const otherAvatar = otherMember?.avatar || ''

  // Join the DM socket channel on mount
  useEffect(() => {
    if (!dmRoomId) return
    joinChannel(dmRoomId)
    return () => {
      leaveChannel(dmRoomId)
    }
  }, [dmRoomId, joinChannel, leaveChannel])

  // Load persisted DM history from the DB (same room id scheme). Page 1 is the
  // newest; each subsequent page holds older messages, prepended on arrival.
  const loadHistory = useCallback(
    async (pageToLoad: number) => {
      if (!dmRoomId || !auth?.token) return

      setLoading(true)
      try {
        const res = await getMessagesByChannelId({
          channelId: dmRoomId,
          token: auth.token,
          page: String(pageToLoad),
        })
        const history = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : []

        setMessages((prev) => {
          const known = new Set(prev.map((m) => m._id))
          const additions = history.filter((m: ChatMessage) => !known.has(m._id))
          return [...additions, ...prev].sort(byCreatedAt)
        })
        if (pageToLoad > 1 && history.length > 0) setPrependTag((t) => t + 1)
        setHasMore(history.length === PAGE_SIZE)
      } catch {
        if (pageToLoad === 1) setMessages([])
        setHasMore(false)
      } finally {
        setLoading(false)
      }
    },
    [dmRoomId, auth?.token],
  )

  useEffect(() => {
    setMessages([])
    setPage(1)
    setHasMore(false)
    prevHeightRef.current = 0
    void loadHistory(1)
  }, [loadHistory, dmRoomId])

  const loadMore = () => {
    const el = listRef.current
    if (el) prevHeightRef.current = el.scrollHeight
    setPage((p) => p + 1)
  }

  // Fetch the newly requested (older) page once `page` changes
  useEffect(() => {
    if (page <= 1) return
    void loadHistory(page)
  }, [page, loadHistory])

  // Preserve scroll position right after older messages were prepended
  useEffect(() => {
    if (prependTag === 0) return
    const el = listRef.current
    if (el && prevHeightRef.current) {
      el.scrollTop += el.scrollHeight - prevHeightRef.current
    }
  }, [prependTag])

  // Listen for incoming messages and append to this DM room
  useEffect(() => {
    if (!newMessageRecieved?._id) return
    if (newMessageRecieved.channelId !== dmRoomId) return

    setMessages((prev) => {
      const exists = prev.some((m) => m._id === newMessageRecieved._id)
      if (exists) return prev
      return [...prev, newMessageRecieved]
    })

    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [newMessageRecieved, dmRoomId])

  // Scroll to bottom on initial load
  useEffect(() => {
    if (page === 1 && messages.length > 0 && !loading) {
      bottomRef.current?.scrollIntoView()
    }
  }, [page, messages, loading])

  const handleSend = (content: string, image?: string, audio?: AudioAttachment) => {
    if (!dmRoomId || !auth?.user?.id) return
    if (!content.trim() && !image && !audio) return
    const messagePayload = {
      channelId: dmRoomId,
      senderId: auth.user.id,
      messageBody: content,
      messageType: audio ? 'audio' : image ? 'image' : 'text',
      mediaUrl: audio ? audio.url : image || undefined,
      mediaPublicId: audio?.publicId,
      mediaMimeType: audio?.mimeType,
      mediaDuration: audio?.duration,
      image: image || undefined,
      audio: audio?.url,
      isDm: true,
    }
    sendNewMessage(messagePayload)
  }

  // Don't allow opening a DM with yourself
  if (memberId === auth?.user?.id) {
    return (
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-2 text-slate-500 px-6 text-center">
        <p className="text-slate-300 font-semibold">You can&apos;t send a DM to yourself</p>
        <p className="text-sm">Messages to yourself aren&apos;t allowed.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-background">
      {/* Header */}
      <div className="shrink-0 px-4 py-3 border-b border-slate-500/30 flex items-center gap-3">
        <Avatar className="size-8 border border-slate-600 shrink-0">
          <AvatarImage src={otherAvatar} />
          <AvatarFallback className="bg-sky-600 text-white text-sm">
            {otherUsername.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-slate-200 font-semibold text-sm leading-tight truncate">
            {otherUsername}
          </p>
          <p className="text-slate-500 text-xs">Direct Message</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={listRef} className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-4 chat-scroll">
        {loading && page === 1 && messages.length === 0 && (
          <div className="flex justify-center py-4">
            <LucideLoader2 className="animate-spin size-6 text-slate-400" />
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center py-2">
            <button
              type="button"
              onClick={loadMore}
              disabled={loading}
              className="text-xs text-blue-400 hover:text-blue-300 disabled:opacity-60 px-3 py-1 rounded-full border border-blue-800/40 bg-blue-950/30"
            >
              {loading ? 'Loading earlier messages...' : 'Load earlier messages'}
            </button>
          </div>
        )}

        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2 pt-16">
            <Avatar className="size-16 border-2 border-slate-600 mb-2">
              <AvatarImage src={otherAvatar} />
              <AvatarFallback className="bg-sky-600 text-white text-2xl">
                {otherUsername.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="text-slate-300 font-semibold">This is the beginning of your DM with</p>
            <p className="text-slate-400 text-sm font-medium">{otherUsername}</p>
          </div>
        )}

        {messages.map((message) => (
          <Message
            key={message._id}
            authorImage={senderAvatarOf(message.senderId) || (senderIdOf(message.senderId) === auth?.user?.id ? auth?.user?.avatar : otherAvatar)}
            authorName={senderNameOf(message.senderId) || (senderIdOf(message.senderId) === auth?.user?.id ? auth?.user?.username : otherUsername)}
            image={message.image || (message.messageType === 'image' ? message.mediaUrl : undefined) || ''}
            audio={
              message.messageType === 'audio'
                ? message.mediaUrl || message.audio || undefined
                : message.audio || undefined
            }
            messageType={message.messageType}
            body={message.messageBody}
            createdAt={new Date(message.createdAt).toLocaleString()}
          />
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div className="shrink-0 border-t border-slate-500/30 bg-background/80 backdrop-blur px-2 sm:px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <ChatInput placeholder={`Message ${otherUsername}...`} onSend={handleSend} />
      </div>
    </div>
  )
}

export default DirectMessagePage