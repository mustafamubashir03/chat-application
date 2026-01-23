import { Button } from '@/components/ui/button'
import { useGetWorkspaceById } from '@/hooks/apis/workspace/useGetWorkspaceById'
import { useCurrentWorkspace } from '@/hooks/context/useCurrentWorkspace'
import useSocket from '@/hooks/context/useSocket'
import { LucideLoader2, SearchIcon, VideoIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const WorkspaceNavbar = () => {
  const { workspaceId } = useParams()
  console.log("workspace Id",workspaceId)
  const { isPending, workspaceDetails } = useGetWorkspaceById({ workspaceId: workspaceId || '' })
  const { setCurrentWorkspace } = useCurrentWorkspace()
  const {socket,peer} = useSocket()
  const navigate = useNavigate()

  useEffect(() => {
    if (workspaceDetails) {
      setCurrentWorkspace(workspaceDetails)
    }
  }, [workspaceDetails, setCurrentWorkspace])
  const handleCreateVideoRoom = () =>{
    if (workspaceId && peer?.id) socket?.emit("create-room",{roomId:workspaceId,peerId:peer?.id})
    workspaceId && navigate(`/workspace/${workspaceId}/videoRoom`)
    console.log('Video Room created from frontend')
  } 
  if (isPending) {
    return (
      <div className="flex items-center justify-center h-14 p-2 bg-[#0b0d1a] text-slate-400">
        <LucideLoader2 className="size-9 animate-spin" />
      </div>
    )
  } else {
    return (
      <nav className="flex items-center  justify-between h-14 p-6 bg-[#0b0d1a]">
        <div className="flex-1"></div>
        <div>
          <Button variant={'darkBlue'} size={'sm'}>
            <SearchIcon />
            <span>Search {workspaceDetails?.name}</span>
          </Button>
        </div>
        <div className="ml-auto flex-1 flex items-center justify-end">
          <Button onClick={handleCreateVideoRoom} variant={'indigoGlow'}>
            <VideoIcon className="cursor-pointer" />
            Start a New Meeting
          </Button>
        </div>
      </nav>
    )
  }
}

export default WorkspaceNavbar
