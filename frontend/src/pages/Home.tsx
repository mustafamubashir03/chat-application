import { useCreateWorkspaceModal } from '@/hooks/apis/workspace/useCreateWorkspaceModal'
import useGetWorkspace from '@/hooks/apis/workspace/useGetWorkspace'
import { Button } from '@/components/ui/button'
import { LucideLoader2, PlusIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const { isFetching, workspaces } = useGetWorkspace()
  const { setOpenCreateWorkspaceModal } = useCreateWorkspaceModal()
  const navigate = useNavigate()
  useEffect(() => {
    if (isFetching) {
      return
    }
    if (workspaces?.length === 0 || !workspaces) {
      setOpenCreateWorkspaceModal(true)
    } else {
      navigate(`/workspace/${workspaces[0]._id}`)
    }
  }, [workspaces, isFetching, navigate])
  return (
    <div className="min-h-dvh bg-background flex items-center justify-center px-6">
      {isFetching && !workspaces ? (
        <LucideLoader2 className="size-8 animate-spin text-slate-500" />
      ) : (
        <div className="flex flex-col items-center text-center gap-3">
          <p className="text-slate-300 font-semibold text-lg">No workspaces yet</p>
          <p className="text-slate-500 text-sm max-w-[320px]">
            Create a workspace to start collaborating with your team in channels and video meetings.
          </p>
          <Button variant={'primary'} size={'lg'} onClick={() => setOpenCreateWorkspaceModal(true)}>
            <PlusIcon className="size-4 mr-1" />
            Create Workspace
          </Button>
        </div>
      )}
    </div>
  )
}

export default Home