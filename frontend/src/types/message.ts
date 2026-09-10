export interface ChatMessageSender {
  _id: string
  username?: string
  avatar?: string
}

export type ChatMessageType = 'text' | 'audio' | 'image' | 'file'

export interface AudioAttachment {
  url: string
  publicId: string
  mimeType: string
  duration: number
}

export interface ChatMessage {
  _id: string
  channelId: string
  messageBody: string
  senderId?: ChatMessageSender | string
  image?: string
  audio?: string
  messageType?: ChatMessageType
  mediaUrl?: string | null
  mediaPublicId?: string | null
  mediaMimeType?: string | null
  mediaDuration?: number | null
  createdAt: string
}