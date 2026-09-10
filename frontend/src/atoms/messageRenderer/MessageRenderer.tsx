import Quill from 'quill'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

const MessageRenderer = ({ value, className }: { value: string; className?: string }) => {
  const rendererRef = useRef<HTMLDivElement | null>(null)
  const [isEmpty, setIsEmpty] = useState(false)

  useEffect(() => {
    const node = rendererRef.current
    if (!node) return

    const quill = new Quill(document.createElement('div'), { theme: 'snow' })
    quill.disable()

    let html = ''
    try {
      const content = JSON.parse(value)
      quill.setContents(content)
      const isContentEmpty = quill.getText().trim().length === 0
      setIsEmpty(isContentEmpty)
      html = quill.root.innerHTML
    } catch {
      // Plain text messages are safe to inject; legacy HTML messages are kept as-is.
      // Anything non-HTML is rendered as text to avoid script injection.
      const temp = document.createElement('div')
      temp.innerHTML = value
      const isHtml = Array.from(temp.childNodes).some((child) => child.nodeType === 1)
      if (isHtml) {
        html = value
        setIsEmpty(temp.textContent?.trim().length === 0)
      } else {
        node.textContent = value
        setIsEmpty(value.trim().length === 0)
        return
      }
    }

    node.innerHTML = html

    return () => {
      node.innerHTML = ''
    }
  }, [value])

  if (isEmpty) return null

  return <div ref={rendererRef} className={cn('text-slate-300 break-words', className)} />
}

export default MessageRenderer