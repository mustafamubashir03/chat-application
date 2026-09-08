import { useEffect, useRef, useState } from 'react'
import { Mic, MicOff, Video, VideoOff, Maximize } from 'lucide-react'

type Props = {
  stream: MediaStream | null
  isLocal?: boolean
  username?: string
  avatar?: string
}

const UserVideoFeedPlayer = ({
  stream,
  isLocal = false,
  username = 'You',
  avatar = '',
}: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)

  /* Attach stream safely (no echo) */
  useEffect(() => {
    const video = videoRef.current
    if (!video || !stream) return

    if (video.srcObject !== stream) {
      video.srcObject = stream
    }

    // 🔒 Never hear yourself
    video.muted = isLocal
    video.volume = isLocal ? 0 : 1
    video.playsInline = true

    video.play().catch(() => {})
  }, [stream, isLocal])

  /* Speaking detection (local + remote, UI only) */
  useEffect(() => {
    if (!stream) return

    const audioTracks = stream.getAudioTracks()
    if (!audioTracks.length) return

    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 512

    const source = audioContext.createMediaStreamSource(stream)
    source.connect(analyser)

    const dataArray = new Uint8Array(analyser.frequencyBinCount)

    let rafId: number

    const detect = () => {
      analyser.getByteFrequencyData(dataArray)

      const avg =
        dataArray.reduce((sum, v) => sum + v, 0) / dataArray.length

      setIsSpeaking(avg > 18 && audioEnabled)

      rafId = requestAnimationFrame(detect)
    }

    detect()

    return () => {
      cancelAnimationFrame(rafId)
      audioContext.close()
    }
  }, [stream, audioEnabled])

  /* Toggle camera */
  const toggleVideo = () => {
    if (!stream) return

    stream.getVideoTracks().forEach((track) => {
      track.enabled = !videoEnabled
    })

    setVideoEnabled((v) => !v)
  }

  /* Toggle mic */
  const toggleAudio = () => {
    if (!stream) return

    stream.getAudioTracks().forEach((track) => {
      track.enabled = !audioEnabled
    })

    setAudioEnabled((v) => !v)
    setIsSpeaking(false)
  }

  return (
    <div
      className={`relative w-full aspect-video max-w-[800px] rounded-xl overflow-hidden bg-black shadow-lg border-2 transition-all duration-200
        ${isSpeaking ? 'border-green-500 ring-2 ring-green-400/60' : 'border-blue-500'}
      `}
    >
      {/* VIDEO — NEVER UNMOUNT */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        playsInline
        muted={isLocal}
      />

      {/* Camera OFF overlay – show avatar + name */}
      {!videoEnabled && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 pointer-events-none gap-3">
          {avatar ? (
            <img
              src={avatar}
              alt={username}
              className="w-16 h-16 rounded-full object-cover border-2 border-slate-500 shadow-lg"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-sky-600 flex items-center justify-center border-2 border-slate-500 shadow-lg">
              <span className="text-white text-2xl font-bold">{username.charAt(0).toUpperCase()}</span>
            </div>
          )}
          <span className="text-white text-sm font-semibold">{username}</span>
        </div>
      )}


      {/* Username + avatar overlay (always visible at bottom-left) */}
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm">
        {avatar ? (
          <img
            src={avatar}
            alt={username}
            className="w-5 h-5 rounded-full object-cover border border-slate-500"
          />
        ) : (
          <div className="w-5 h-5 rounded-full bg-sky-600 flex items-center justify-center border border-slate-500">
            <span className="text-white text-[9px] font-bold">{username.charAt(0).toUpperCase()}</span>
          </div>
        )}
        <span className="text-xs text-white font-medium truncate max-w-[120px]">{username}</span>
      </div>

      {/* Controls */}
      <div className="absolute bottom-2 right-2 flex gap-2">
        <button
          onClick={toggleAudio}
          className={`relative p-2 rounded-full ${
            audioEnabled ? 'bg-gray-700' : 'bg-red-600'
          }`}
        >
          {audioEnabled ? <Mic size={14} /> : <MicOff size={14} />}

          {/* Speaking indicator */}
          {isSpeaking && audioEnabled && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping" />
          )}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-2 rounded-full ${
            videoEnabled ? 'bg-gray-700' : 'bg-red-600'
          }`}
        >
          {videoEnabled ? <Video size={14} /> : <VideoOff size={14} />}
        </button>

        <button
          onClick={() => {
            if (videoRef.current?.requestFullscreen) {
              videoRef.current.requestFullscreen().catch(() => {})
            }
          }}
          className="p-2 rounded-full bg-gray-700"
        >
          <Maximize size={14} />
        </button>
      </div>
    </div>
  )
}

export default UserVideoFeedPlayer
