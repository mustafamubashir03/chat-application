import { useCallback, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import type { Socket } from 'socket.io-client'

/**
 * Sends a `newMessage` payload over the socket. If the socket is not
 * connected (connecting, disconnected, or not yet created), the payload is
 * queued and flushed automatically once the socket reconnects, so messages
 * (including voice notes) are never silently dropped.
 *
 * Every emit carries an ack callback: the backend replies { success, message }
 * after persisting the message. If it replies with success:false, the user is
 * told the send failed instead of it silently disappearing.
 */
const useQueuedNewMessageSender = (socket: Socket | null) => {
  const queueRef = useRef<Record<string, unknown>[]>([])
  const notifiedRef = useRef(false)

  const emitWithAck = useCallback(
    (payload: Record<string, unknown>) => {
      if (!socket) return

      socket.emit(
        'newMessage',
        payload,
        (response?: { success: boolean; message?: string }) => {
          if (response?.success === false) {
            toast.error(
              response.message || 'Message failed to send. Please try again.',
            )
          }
        },
      )
    },
    [socket],
  )

  const sendNewMessage = useCallback(
    (payload: Record<string, unknown>) => {
      if (socket?.connected) {
        emitWithAck(payload)
        return
      }

      queueRef.current.push(payload)

      if (!notifiedRef.current) {
        notifiedRef.current = true
        toast.info('You are temporarily offline — message will be sent when reconnected.')
      }
    },
    [socket, emitWithAck],
  )

  useEffect(() => {
    if (!socket?.connected) return

    const pending = queueRef.current.splice(0, queueRef.current.length)
    notifiedRef.current = false

    pending.forEach(emitWithAck)
  }, [socket, socket?.connected, emitWithAck])

  return sendNewMessage
}

export default useQueuedNewMessageSender