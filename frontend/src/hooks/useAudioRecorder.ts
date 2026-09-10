import { useCallback, useEffect, useRef, useState } from 'react'

export type RecorderStatus = 'idle' | 'recording' | 'recorded'

interface UseAudioRecorderReturn {
  status: RecorderStatus
  blob: Blob | null
  durationMs: number
  error: string | null
  supported: boolean
  startRecording: () => Promise<void>
  stopRecording: () => void
  reset: () => void
}

const useAudioRecorder = (): UseAudioRecorderReturn => {
  const [status, setStatus] = useState<RecorderStatus>('idle')
  const [blob, setBlob] = useState<Blob | null>(null)
  const [durationMs, setDurationMs] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const startTimeRef = useRef(0)
  const timerRef = useRef<number | null>(null)

  const supported =
    typeof window !== 'undefined' &&
    typeof window.MediaRecorder !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const cleanupStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }, [])

  const startRecording = useCallback(async () => {
    try {
      if (!supported) {
        setError('Audio recording is not supported in this browser')
        return
      }
      setError(null)
      setBlob(null)
      setDurationMs(0)
      chunksRef.current = []

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : ''

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream)
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        setBlob(audioBlob)
        setStatus('recorded')
        stopTimer()
        cleanupStream()
      }

      recorder.onerror = () => {
        setError('Recording failed. Please try again.')
        stopTimer()
        cleanupStream()
        mediaRecorderRef.current = null
        setStatus('idle')
      }

      recorder.start()
      startTimeRef.current = Date.now()
      setStatus('recording')
      timerRef.current = window.setInterval(() => {
        setDurationMs(Date.now() - startTimeRef.current)
      }, 250)
    } catch {
      setError('Microphone permission was denied or is unavailable.')
      cleanupStream()
      setStatus('idle')
    }
  }, [supported, cleanupStream, stopTimer])

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop()
    }
  }, [])

  const reset = useCallback(() => {
    stopTimer()
    cleanupStream()
    mediaRecorderRef.current = null
    chunksRef.current = []
    setBlob(null)
    setDurationMs(0)
    setError(null)
    setStatus('idle')
  }, [cleanupStream, stopTimer])

  useEffect(() => {
    return () => reset()
  }, [reset])

  return {
    status,
    blob,
    durationMs,
    error,
    supported,
    startRecording,
    stopRecording,
    reset,
  }
}

export default useAudioRecorder