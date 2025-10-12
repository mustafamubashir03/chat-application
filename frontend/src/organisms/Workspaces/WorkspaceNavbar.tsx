import { Button } from '@/components/ui/button'
import { useGetWorkspaceById } from '@/hooks/apis/workspace/useGetWorkspaceById'
import { InfoIcon, LucideLoader2, SearchIcon } from 'lucide-react'
import { useParams } from 'react-router-dom'
import WorkspaceSwitcher from './WorkspaceSwitcher'

const WorkspaceNavbar = () => {
  const { workspaceId } = useParams()
  const { isPending, workspaceDetails } = useGetWorkspaceById({ workspaceId: workspaceId || '' })
  if (isPending) {
    return (
      <div className="flex items-center justify-center h-14 p-2 bg-[#0b0d1a] text-slate-400">
        <LucideLoader2 className="size-9 animate-spin" />
      </div>
    )
  } else {
    return (
      <nav className="flex items-center  justify-between h-14 p-2 bg-[#0b0d1a]">
        <div className="flex-1"></div>
        <div>
          <Button variant={'darkBlue'} size={'sm'}>
            <SearchIcon />
            <span>Search {workspaceDetails.name}</span>
          </Button>
        </div>
        <div className="ml-auto flex-1 flex items-center justify-end">
          <Button variant={'indigoGlow'} size={'icon'}>
            <InfoIcon className="cursor-pointer" />
          </Button>
        </div>
      </nav>
    )
  }
}

export default WorkspaceNavbar
