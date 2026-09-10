import { uploadAudioToCloudinary, uploadImageToCloudinary } from '@/apis/cloudinary'
import useAudioRecorder from '@/hooks/useAudioRecorder'
import type { AudioAttachment } from '@/types/message'
import { cn } from '@/lib/utils'
import { Loader2, Mic, Paperclip, Send, Smile, Square, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { toast } from 'sonner'

const EMOJIS = [
  '😀', '😂', '😍', '🥰', '😎', '🤔', '😅', '😭',
  '😡', '👍', '👎', '🙏', '👏', '🙌', '💪', '🔥',
  '✨', '🎉', '❤️', '💔', '✅', '❌', '🤝', '👋',
  '💯', '🎁', '⚡', '🌙', '☀️', '🌈', '🍕', '☕',
  '😴', '🤯', '🥳', '😇', '🤗', '😬', '🫡', '🤩',
]

const formatDuration = (durationMs: number) => {
  const totalSeconds = Math.floor(durationMs / 1000)
  const mins = Math.floor(totalSeconds / 60)
  const secs = (totalSeconds % 60).toString().padStart(2, '0')
  return `${mins}:${secs}`
}

interface ChatInputProps {
  placeholder?: string
  onSend: (content: string, image?: string, audio?: AudioAttachment) => void
  className?: string
}

const ChatInput = ({ placeholder = 'Type a message...', onSend, className }: ChatInputProps) => {
  const [text, setText] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [emojiOpen, setEmojiOpen] = useState(false)
  const {
    status,
    blob,
    durationMs,
    error,
    supported,
    startRecording,
    stopRecording,
    reset,
  } = useAudioRecorder()

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isRecording = status === 'recording'
  const hasAudioBlob = status === 'recorded' && !!blob
  const canSend = text.trim().length > 0 || !!imageUrl || hasAudioBlob

  /* ---------------- AUTOSIZE TEXTAREA ---------------- */
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [text])

  /* ---------------- AUTO-SEND VOICE NOTE ---------------- */
  const [voiceFailed, setVoiceFailed] = useState(false)
  const autoSentForRef = useRef<Blob | null>(null)
  const voiceBusy = hasAudioBlob && !voiceFailed

  // The moment a recording stops, upload it and push it through the normal
  // message pipeline (onSend -> socket 'newMessage' -> backend -> Mongo).
  // There is deliberately no separate Send button for voice notes.
  const sendVoiceAutomatically = useCallback(
    async (voiceBlob: Blob) => {
      if (voiceBlob.size === 0) {
        setVoiceFailed(true)
        return
      }

      setVoiceFailed(false)
      try {
        const file = new File([voiceBlob], 'voice-note.webm', {
          type: voiceBlob.type || 'audio/webm',
        })
        const { url, publicId } = await uploadAudioToCloudinary(file)
        onSend(text.trim(), undefined, {
          url,
          publicId,
          mimeType: voiceBlob.type || 'audio/webm',
          duration: durationMs / 1000,
        })
        setText('')
        setImageUrl(null)
        setEmojiOpen(false)
        reset()
      } catch {
        setVoiceFailed(true)
      }
    },
    [durationMs, onSend, reset, text],
  )

  // Track which blob was already auto-sent so one recording produces exactly
  // one message (guards against re-running effects / double uploads).
  useEffect(() => {
    if (status !== 'recorded' || !blob) return
    if (autoSentForRef.current === blob) return
    autoSentForRef.current = blob
    void sendVoiceAutomatically(blob)
  }, [blob, sendVoiceAutomatically, status])

  const retryVoiceSend = () => {
    if (!blob) return
    void sendVoiceAutomatically(blob)
  }

  const discardVoice = () => {
    autoSentForRef.current = null
    setVoiceFailed(false)
    reset()
  }

  /* ---------------- IMAGE ATTACH ---------------- */
  const handleImageSelect = async (file: File) => {
    setImageUploading(true)
    try {
      const url = await uploadImageToCloudinary(file)
      setImageUrl(url)
    } catch {
      toast.error('Image upload failed. Please try again.')
    } finally {
      setImageUploading(false)
    }
  }

  /* ---------------- SEND ---------------- */
  // Manual send is only used for text + images. Voice notes auto-send the
  // moment recording stops (see AUTO-SEND VOICE NOTE above), so there is no
  // separate Send button for a completed recording.
  const handleSend = async () => {
    if (!canSend || imageUploading) return

    onSend(text.trim(), imageUrl || undefined)

    setText('')
    setImageUrl(null)
    setEmojiOpen(false)
    reset()
  }

  const handleTextareaKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      void handleSend()
    }
  }

  const insertEmoji = (emoji: string) => {
    setText((prev) => prev + emoji)
    setEmojiOpen(false)
    textareaRef.current?.focus()
  }

  return (
    <div className={cn('relative w-full', className)}>
      {/* Error message */}
      {error && (
        <div className="flex items-center justify-between mb-2 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-800/40 text-xs text-red-300">
          <span>{error}</span>
          <button
            onClick={reset}
            className="text-red-400 hover:text-red-200 font-medium shrink-0 ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Emoji palette */}
      {emojiOpen && (
        <div className="absolute bottom-full left-0 mb-2 z-20 w-full max-w-[300px] rounded-xl bg-[#161a2c] border border-slate-700/70 shadow-2xl p-2">
          <div className="grid grid-cols-8 gap-0.5 max-h-44 overflow-y-auto chat-scroll">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => insertEmoji(emoji)}
                className="flex items-center justify-center size-8 rounded-md hover:bg-white/10 text-lg"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Image preview */}
      {imageUploading && (
        <div className="mb-2 flex items-center gap-3">
          <div className="w-16 h-16 rounded-lg border border-slate-700 bg-slate-800 flex items-center justify-center">
            <Loader2 className="size-5 animate-spin text-slate-400" />
          </div>
          <span className="text-xs text-slate-500">Uploading image...</span>
        </div>
      )}
      {imageUrl && !imageUploading && (
        <div className="mb-2 flex items-center gap-3">
          <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-700">
            <img src={imageUrl} alt="Selected image" className="w-full h-full object-cover" />
          </div>
          <button
            type="button"
            onClick={() => setImageUrl(null)}
            className="size-8 shrink-0 rounded-full border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-800/60 flex items-center justify-center transition-colors"
            aria-label="Remove image"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      )}

      {isRecording ? (
        /* ---------------- RECORDING STRIP ---------------- */
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-950/30 border border-red-800/40">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="text-xs font-medium text-red-300">Recording</span>
          <span className="text-xs text-red-200 tabular-nums">{formatDuration(durationMs)}</span>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={reset}
              className="size-9 rounded-full border border-slate-700 text-slate-400 hover:text-red-400 flex items-center justify-center transition-colors"
              aria-label="Cancel recording"
            >
              <Trash2 className="size-4" />
            </button>
            <button
              type="button"
              onClick={stopRecording}
              className="size-9 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors"
              aria-label="Stop recording"
            >
              <Square className="size-3 fill-current" />
            </button>
          </div>
        </div>
      ) : voiceBusy ? (
        /* ---------------- VOICE UPLOADING ---------------- */
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-sky-950/30 border border-sky-800/40">
          <Loader2 className="size-5 animate-spin text-sky-300 shrink-0" />
          <span className="text-xs font-medium text-sky-300">Sending voice note...</span>
        </div>
      ) : voiceFailed ? (
        /* ---------------- VOICE FAILURE / RETRY ---------------- */
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-950/30 border border-red-800/40">
          <span className="text-xs font-medium text-red-300 flex-1">Voice note failed to send.</span>
          <button
            type="button"
            onClick={retryVoiceSend}
            className="shrink-0 rounded-full bg-blue-600 hover:bg-blue-500 px-3 py-1 text-xs font-medium text-white transition-colors"
          >
            Retry
          </button>
          <button
            type="button"
            onClick={discardVoice}
            className="shrink-0 rounded-full border border-slate-700 px-3 py-1 text-xs font-medium text-slate-400 hover:text-red-300 transition-colors"
          >
            Discard
          </button>
        </div>
      ) : (
        /* ---------------- COMPOSER ROW ---------------- */
        <div className="flex items-end gap-2">
          {/* Mic / Send toggle */}
          {!canSend && supported && (
            <button
              type="button"
              onClick={() => void startRecording()}
              className="size-10 shrink-0 rounded-full bg-[#212435] border border-neutral-700 text-slate-300 hover:text-blue-300 hover:border-blue-700/60 flex items-center justify-center transition-colors"
              aria-label="Record voice note"
            >
              <Mic className="size-5" />
            </button>
          )}
          {canSend && (
            <button
              type="button"
              onClick={() => void handleSend()}
              disabled={imageUploading}
              className="size-10 shrink-0 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-900/40 transition-colors disabled:opacity-50 disabled:pointer-events-none"
              aria-label="Send message"
            >
              <Send className="size-5" />
            </button>
          )}

          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleTextareaKeyDown}
            placeholder={placeholder}
            rows={1}
            className="flex-1 resize-none bg-[#212435] border border-neutral-700 rounded-2xl px-4 py-2.5 text-sm text-slate-300 placeholder-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 min-h-[40px] max-h-[120px] overflow-y-auto chat-scroll"
          />

          <button
            type="button"
            onClick={() => setEmojiOpen((open) => !open)}
            className={cn(
              'size-10 shrink-0 rounded-full flex items-center justify-center transition-colors border',
              emojiOpen
                ? 'bg-blue-950/60 border-blue-700/70 text-blue-300'
                : 'bg-[#212435] border-neutral-700 text-slate-400 hover:text-yellow-300 hover:border-yellow-700/50',
            )}
            aria-label="Emoji"
          >
            <Smile className="size-5" />
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={imageUploading}
            className="size-10 shrink-0 rounded-full bg-[#212435] border border-neutral-700 text-slate-400 hover:text-blue-300 hover:border-blue-700/60 flex items-center justify-center transition-colors disabled:opacity-50 disabled:pointer-events-none"
            aria-label="Attach image"
          >
            {imageUploading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Paperclip className="size-5" />
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void handleImageSelect(file)
              e.target.value = ''
            }}
          />
        </div>
      )}
    </div>
  )
}

export default ChatInput