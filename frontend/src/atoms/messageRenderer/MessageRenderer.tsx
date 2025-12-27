import Quill from 'quill'
import { useEffect, useRef, useState } from 'react'

const MessageRenderer = ({ value }: { value: string }) => {
  const rendererRef = useRef<HTMLDivElement | null>(null)
  const [isEmpty, setIsEmpty] = useState(false)

  useEffect(() => {
    if (!rendererRef.current) return

    const quill = new Quill(document.createElement('div'), { theme: 'snow' })
    quill.disable()

    let html = ''
    try {
      // Try Delta JSON
      const content = JSON.parse(value)
      quill.setContents(content)
      const isContentEmpty = quill.getText().trim().length === 0
      setIsEmpty(isContentEmpty)
      html = quill.root.innerHTML
    } catch {
      // Fallback: assume raw HTML
      html = value
      const temp = document.createElement('div')
      temp.innerHTML = value
      const text = temp.textContent?.trim() || ''
      setIsEmpty(text.length === 0)
    }

    rendererRef.current.innerHTML = html

    return () => {
      if (rendererRef.current) {
        rendererRef.current.innerHTML = ''
      }
    }
  }, [value])

  if (isEmpty) return null

  return <div ref={rendererRef} className="text-slate-300" />
}

export default MessageRenderer
