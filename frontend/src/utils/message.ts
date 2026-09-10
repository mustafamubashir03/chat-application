import type { ChatMessageSender } from '@/types/message'

export const senderIdOf = (sender?: ChatMessageSender | string) =>
  typeof sender === 'string' ? sender : sender?._id ?? ''

export const senderAvatarOf = (sender?: ChatMessageSender | string) =>
  typeof sender === 'object' && sender ? (sender.avatar ?? '') : ''

export const senderNameOf = (sender?: ChatMessageSender | string) =>
  typeof sender === 'object' && sender ? (sender.username ?? '') : ''