import { useCallback, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import type { Socket } from 'socket.io-client'

/**
 * Sends a `newMessage` payload over the socket. If the socket is not
 * connected (connecting, disconnected, or not yet created), the payload is
 * queued and flushed automatically once the socket reconnects, so messages
 * (including voice notes) are never silently dropped.
 */
const useQueuedNewMessageSender = (socket: Socket | null) => {
  const queueRef = useRef<Record<string, unknown>[]>([])
  const notifiedRef = useRef(false)

  const sendNewMessage = useCallback(
    (payload: Record<string, unknown>) => {
      if (socket?.connected) {
        socket.emit('newMessage', payload)
        return
      }

      queueRef.current.push(payload)

      if (!notifiedRef.current) {
        notifiedRef.current = true
        toast.info('You are temporarily offline — message will be sent when reconnected.')
      }
    },
    [socket],
  )

  useEffect(() => {
    if (!socket?.connected) return

    const pending = queueRef.current.splice(0, queueRef.current.length)
    notifiedRef.current = false

    pending.forEach((payload) => socket.emit('newMessage', payload))
  }, [socket, socket?.connected])

  return sendNewMessage
}

export default useQueuedNewMessageSender