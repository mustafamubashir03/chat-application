import { useEffect, useRef, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { LucideLoader2 } from 'lucide-react'

import useSocket from '@/hooks/context/useSocket'
import { useAuth } from '@/hooks/context/useAuth'
import { useGetWorkspaceById } from '@/hooks/apis/workspace/useGetWorkspaceById'
import { getMessagesByChannelId } from '@/apis/channel'

import ChatInput from '@/molecules/ChatInput/ChatInput'
import Message from '@/molecules/Message/Message'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

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

  const { joinChannel, leaveChannel, newMessageRecieved, socket } = useSocket()
  const { workspaceDetails } = useGetWorkspaceById({ workspaceId: workspaceId || '' })

  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Deterministic DM room id – sorted so both users get the same id
  const dmRoomId = useMemo(() => {
    if (!auth?.user?.id || !memberId) return null
    return [auth.user.id, memberId].sort().join('_')
  }, [auth?.user?.id, memberId])

  // Find the other member's profile from workspace members list
  const otherMember = useMemo(() => {
    if (!workspaceDetails?.members || !memberId) return null
    return workspaceDetails.members.find(
      (m: any) => m?.memberId?._id === memberId || m?.memberId === memberId,
    )?.memberId
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

  // Load persisted DM history from the DB (same room id scheme)
  useEffect(() => {
    if (!dmRoomId || !auth?.token) return

    setLoading(true)
    getMessagesByChannelId({ channelId: dmRoomId, token: auth.token })
      .then((res) => {
        const history = Array.isArray(res?.data) ? res.data : []
        setMessages(
          [...history].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          ),
        )
      })
      .catch(() => setMessages([]))
      .finally(() => setLoading(false))
  }, [dmRoomId, auth?.token])

  // Listen for incoming messages and append to this DM room
  useEffect(() => {
    if (!newMessageRecieved?._id) return
    if (newMessageRecieved.channelId !== dmRoomId) return

    setMessages((prev) => {
      const exists = prev.some((m) => m._id === newMessageRecieved._id)
      if (exists) return prev
      return [...prev, newMessageRecieved]
    })
  }, [newMessageRecieved, dmRoomId])

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (content: string, image?: string, audio?: string) => {
    if (!socket || !dmRoomId || !auth?.user?.id) return
    if (!content.trim() && !image && !audio) return
    const messagePayload = {
      channelId: dmRoomId,
      senderId: auth.user.id,
      messageBody: content,
      image: image || undefined,
      audio: audio || undefined,
      isDm: true,
    }
    socket.emit('newMessage', messagePayload)
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
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-4 chat-scroll">
        {loading && (
          <div className="flex justify-center py-4">
            <LucideLoader2 className="animate-spin size-6 text-slate-400" />
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
            authorImage={message.senderId?.avatar || (message.senderId === auth?.user?.id ? auth?.user?.avatar : otherAvatar)}
            authorName={message.senderId?.username || (message.senderId === auth?.user?.id ? auth?.user?.username : otherUsername)}
            image={message.image || ''}
            audio={message.audio || undefined}
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