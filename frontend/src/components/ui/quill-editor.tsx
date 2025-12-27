import { useMemo, useRef, useEffect } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { SendIcon } from 'lucide-react'
import useSocket from '@/hooks/context/useSocket'
import { useAuth } from '@/hooks/context/useAuth'
import { useCurrentWorkspace } from '@/hooks/context/useCurrentWorkspace'
import { useQueryClient } from '@tanstack/react-query'

interface QuillEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  readOnly?: boolean
}

const QuillEditor = ({
  value,
  onChange,
  placeholder = 'Type a message…',
  className,
  readOnly = false,
}: QuillEditorProps) => {
  const quillRef = useRef<ReactQuill | null>(null)
  const { currentChannel, socket } = useSocket()
  const { currentWorkspace } = useCurrentWorkspace()
  const { auth } = useAuth()
  const queryClient = useQueryClient()

  const handleMessageSubmit = () => {
    if (!quillRef.current) return
    const editor = quillRef.current.getEditor()
    const delta = editor.getContents()

    if (!delta.ops?.some((op: any) => op.insert?.trim?.())) return

    socket?.emit('newMessage', {
      messageBody: JSON.stringify(delta),
      channelId: currentChannel,
      workspaceId: currentWorkspace,
      senderId: auth.user?.id,
    })

    editor.setText('')
    queryClient.invalidateQueries({ queryKey: ['getMessagesByChannelId'] })
  }

  const modules = useMemo(
    () => ({
      toolbar: readOnly
        ? false
        : [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ align: [] }],
            ['link', 'image'],
            ['clean'],
          ],
      clipboard: { matchVisual: false },
    }),
    [readOnly],
  )

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .quill {
        font-family: 'Plus Jakarta Sans', sans-serif;
      }

      .ql-toolbar {
        background: rgba(15, 23, 42, 0.7);
        border: 1px solid rgba(71, 85, 105, 0.3);
        border-bottom: none;
        border-radius: 14px 14px 0 0;
      }

      .ql-container {
        border-radius: 0 0 14px 14px;
        border: 1px solid rgba(71, 85, 105, 0.3);
        background: rgba(15, 23, 42, 0.6);
      }

      .ql-container.ql-focused {
        border-color: rgb(99 102 241);
      }

      .ql-editor {
        min-height: 48px;
        max-height: 160px;
        padding: 10px 44px 10px 14px;
        font-size: 15px;
        line-height: 1.5;
        color: rgb(226 232 240);
        overflow-y: auto;
      }

      .ql-editor.ql-blank::before {
        color: rgb(148 163 184);
        left: 14px;
        font-style: normal;
      }

      .ql-editor::-webkit-scrollbar {
        width: 4px;
      }

      .ql-editor::-webkit-scrollbar-thumb {
        background: rgba(148, 163, 184, 0.35);
        border-radius: 6px;
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  return (
    <div className={cn('relative w-full', className)}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
        readOnly={readOnly}
      />

      {!readOnly && (
        <Button
          onClick={handleMessageSubmit}
          variant="primary"
          className="absolute right-2 bottom-2 h-9 w-9 rounded-full p-0 flex items-center justify-center"
        >
          <SendIcon size={16} />
        </Button>
      )}
    </div>
  )
}

export default QuillEditor
