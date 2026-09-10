import { Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState, type MouseEvent } from 'react'

const formatDuration = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')
  return `${mins}:${secs}`
}

const AudioMessage = ({ src }: { src: string }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = new Audio(src)
    audio.preload = 'metadata'
    audioRef.current = audio

    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleEnded = () => {
      setPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.pause()
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.src = ''
      audioRef.current = null
    }
  }, [src])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      void audio.play().catch(() => undefined)
    }
    setPlaying(!playing)
  }

  const handleSeek = (e: MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || duration === 0) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1)
    audio.currentTime = ratio * duration
    setCurrentTime(audio.currentTime)
  }

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="flex items-center gap-3 w-full max-w-[320px] rounded-2xl border border-slate-700 bg-slate-800/80 px-3 py-2.5">
      <button
        type="button"
        onClick={togglePlay}
        className="size-9 shrink-0 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white transition-colors"
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? (
          <Pause className="size-4" />
        ) : (
          <Play className="size-4 ml-0.5" />
        )}
      </button>

      <div className={`audio-eq ${playing ? 'is-playing' : ''}`} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div
        className="flex-1 min-w-0 cursor-pointer"
        role="slider"
        aria-label="Seek audio"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(currentTime)}
        onClick={handleSeek}
      >
        <div className="h-1.5 w-full rounded-full bg-slate-700/80 overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-500 transition-[width] duration-100"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-[11px] text-slate-400 tabular-nums leading-none">
          <span>{formatDuration(currentTime)}</span>
          <span>{formatDuration(duration)}</span>
        </div>
      </div>
    </div>
  )
}

export default AudioMessage