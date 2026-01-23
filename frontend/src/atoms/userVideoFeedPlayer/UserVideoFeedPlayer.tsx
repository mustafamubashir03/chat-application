import { useEffect, useRef, useState } from 'react'
import { Mic, MicOff, Video, VideoOff, Maximize } from 'lucide-react'

type Props = {
  stream: MediaStream | null
  isLocal?: boolean
  username?: string
}

const UserVideoFeedPlayer = ({ stream, isLocal = false, username = 'You' }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)

  /* Attach stream ONCE */
  useEffect(() => {
    const video = videoRef.current
    if (!video || !stream) return

    if (video.srcObject !== stream) {
      video.srcObject = stream
    }

    video.muted = isLocal
    video.playsInline = true

    video.play().catch(() => {})
  }, [stream, isLocal])

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
  }

  return (
    <div className="relative w-full aspect-video max-w-[800px] rounded-xl overflow-hidden bg-black shadow-lg border-blue-500 border-2">
      {/* VIDEO — NEVER UNMOUNT */}
      <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />

      {/* Camera OFF overlay */}
      {!videoEnabled && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-gray-400 pointer-events-none">
          <VideoOff size={40} />
        </div>
      )}

      {/* Username */}
      <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/60 text-xs text-white">
        {username}
      </div>

      {/* Controls */}
      <div className="absolute bottom-2 right-2 flex gap-2">
        <button
          onClick={toggleAudio}
          className={`p-2 rounded-full ${audioEnabled ? 'bg-gray-700' : 'bg-red-600'}`}
        >
          {audioEnabled ? <Mic size={14} /> : <MicOff size={14} />}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-2 rounded-full ${videoEnabled ? 'bg-gray-700' : 'bg-red-600'}`}
        >
          {videoEnabled ? <Video size={14} /> : <VideoOff size={14} />}
        </button>

        <button
          onClick={() => {
            if (videoRef.current && videoRef.current.requestFullscreen) {
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
