import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useGetWorkspace from '@/hooks/apis/workspace/useGetWorkspace'
import { useGetWorkspaceById } from '@/hooks/apis/workspace/useGetWorkspaceById'
import { LucideLoader2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

const WorkspaceSwitcher = () => {
  const navigate = useNavigate()
  const { workspaces, isFetching } = useGetWorkspace()
  const { workspaceId } = useParams()
  const { isPending, workspaceDetails } = useGetWorkspaceById({ workspaceId: workspaceId || '' })
  const handleWorkspaceSwitching = (workspace: any) => {
    navigate(`/workspace/${workspace._id}`)
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="font-semibold text-xl text-blue-300 px-4 py-6" variant={'BlueDark'}>
          {isPending ? (
            <LucideLoader2 className="size-5 spin" />
          ) : (
            workspaceDetails.name[0].toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-slate-300 bg-gradient-to-r from-[#101321] via-[#151827] to-[#121423] border-none">
        <DropdownMenuLabel>Select Workspace</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-800" />
        <DropdownMenuItem className="text-blue-400">{workspaceDetails?.name}</DropdownMenuItem>
        {isFetching ? (
          <LucideLoader2 />
        ) : (
          workspaces.map((workspace: any) => {
            if (workspace?.name === workspaceDetails?.name) {
              return
            }

            return (
              <DropdownMenuItem
                onClick={() => handleWorkspaceSwitching(workspace)}
                className="text-slate-400 truncate cursor-pointer"
              >
                {workspace?.name}
              </DropdownMenuItem>
            )
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default WorkspaceSwitcher
