import { useMemo, useRef, useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { SendIcon } from 'lucide-react';
import useSocket from '@/hooks/context/useSocket';
import { useAuth } from '@/hooks/context/useAuth';
import { useCurrentWorkspace } from '@/hooks/context/useCurrentWorkspace';
import { useQueryClient } from '@tanstack/react-query';
import { uploadImageToCloudinary } from '@/apis/cloudinary';

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

const QuillEditor = ({
  value,
  onChange,
  placeholder = 'Type a message…',
  className,
  readOnly = false,
}: QuillEditorProps) => {
  const quillRef = useRef<ReactQuill | null>(null);
  const { currentChannel, socket } = useSocket();
  const { currentWorkspace } = useCurrentWorkspace();
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  /** Custom image handler for Quill toolbar */
  const handleQuillImage = async (quill: any) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        const uploadedUrl = await uploadImageToCloudinary(file);

        // Set the uploaded URL in separate image state
        setImageUrl(uploadedUrl);

        // Do NOT insert image into editor
        // Optionally insert placeholder text if you want user feedback
        // quill.insertText(quill.getSelection(true).index, '[image]');
      } catch (err) {
        console.error('Image upload failed', err);
      }
    };
  };

  /** Send message */
  const handleMessageSubmit = () => {
    if (!quillRef.current) return;
    const editor = quillRef.current.getEditor();
    const delta = editor.getContents();

    // Only send if there is text or image
    if (!delta.ops?.some((op: any) => op.insert?.trim?.()) && !imageUrl) return;

    // Clean text (remove images if any sneaked in)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = editor.root.innerHTML;
    const images = tempDiv.querySelectorAll('img');
    images.forEach((img) => img.remove());
    const textOnly = tempDiv.innerHTML;

    socket?.emit('newMessage', {
      messageBody: textOnly,
      image: imageUrl || undefined,
      channelId: currentChannel,
      workspaceId: currentWorkspace,
      senderId: auth.user?.id,
    });

    editor.setText('');
    setImageUrl(null);
    queryClient.invalidateQueries({ queryKey: ['getMessagesByChannelId'] });
  };

  /** Quill modules */
  const modules = useMemo(
    () => ({
      toolbar: readOnly
        ? false
        : {
            container: [
              [{ header: [1, 2, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ align: [] }],
              ['link', 'image'],
              ['clean'],
            ],
            handlers: {
              image: function () {
                handleQuillImage(this.quill);
              },
            },
          },
      clipboard: { matchVisual: false },
    }),
    [readOnly],
  );

  /** Custom styling */
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .quill { font-family: 'Plus Jakarta Sans', sans-serif; }
      .ql-toolbar {
        background: rgba(15,23,42,0.7);
        border: 1px solid rgba(71,85,105,0.3);
        border-bottom: none;
        border-radius: 14px 14px 0 0;
      }
      .ql-container {
        border-radius: 0 0 14px 14px;
        border: 1px solid rgba(71,85,105,0.3);
        background: rgba(15,23,42,0.6);
      }
      .ql-container.ql-focused { border-color: rgb(99 102 241); }
      .ql-editor {
        min-height: 48px;
        max-height: 160px;
        padding: 10px 44px 10px 14px;
        font-size: 15px;
        line-height: 1.5;
        color: rgb(226 232 240);
        overflow-y: auto;
      }
      .ql-editor.ql-blank::before { color: rgb(148 163 184); left: 14px; font-style: normal; }
      .ql-editor::-webkit-scrollbar { width: 4px; }
      .ql-editor::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.35); border-radius: 6px; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

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
  );
};

export default QuillEditor;
