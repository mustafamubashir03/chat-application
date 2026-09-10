export interface ChatMessageSender {
  _id: string
  username?: string
  avatar?: string
}

export interface ChatMessage {
  _id: string
  channelId: string
  messageBody: string
  senderId?: ChatMessageSender | string
  image?: string
  audio?: string
  createdAt: string
}