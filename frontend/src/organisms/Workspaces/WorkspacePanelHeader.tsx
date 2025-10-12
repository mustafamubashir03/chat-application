import { Button } from '@/components/ui/button'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/context/useAuth'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu'
import {
  ChevronDown,
  ListFilterIcon,
  PlusCircleIcon,
  Settings2,
  User2Icon,
  Users,
} from 'lucide-react'

const WorkspacePanelHeader = ({ workspace }: { workspace: any }) => {
  const members = workspace?.members
  const { auth } = useAuth()
  const isLoggedinUserAdminOfWorkspace = members.find(
    (member: any) => member.memberId === auth?.user?.id && member.role === 'admin',
  )

  return (
    <div className="flex items-center justify-around h-[50px] px-4 gap-0.5">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant={'transparent'}
            className="font-semibold text-lg overflow-hidden w-auto p-1.5 cursor-pointer hover:border-none"
          >
            <span className="truncate flex items-center justify-center">
              {workspace?.name}
              <ChevronDown className="size-5 ml-2 text-slate-400" />
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          align="start"
          className="w-64 hover:border-none text-slate-300 p-1.5 shadow-lg bg-gradient-to-r from-[#101321] via-[#151827] to-[#121423] border-none rounded-lg"
        >
          <DropdownMenuItem className="flex items-center hover:border-none">
            <div className="size-9 relateive overflow-hidden rounded-md bg-blue-600 text-slate-300 font-semibold text-sl flex  items-center justify-center mr-2">
              {workspace?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold">{workspace.name}</p>
              <p className="text-xs text-blue-300/80 ">Active Workspace</p>
            </div>
          </DropdownMenuItem>
          {isLoggedinUserAdminOfWorkspace && (
            <div className="flex flex-col items-start gap-2 p-2">
              <DropdownMenuItem className="text-sm cursor-pointer flex justify-center gap-1.5 hover:text-blue-500">
                {' '}
                <Settings2 className="size-4 mr-1 text-blue-500" /> Preferences
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm cursor-pointer flex justify-center gap-1.5 hover:text-blue-500">
                <Users className="size-4 mr-1 text-blue-500" /> Invite people to {workspace.name}
              </DropdownMenuItem>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex items-center text-slate-400 gap-0.5">
        <Button className="cursor-pointer" variant={'transparent'} size={'icon'}>
          <ListFilterIcon />
        </Button>
      </div>
    </div>
  )
}

export default WorkspacePanelHeader
