import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCreateWorkspaceModal } from '@/hooks/apis/workspace/useCreateWorkspaceModal'
import { useAuth } from '@/hooks/context/useAuth'
import { useConfirm } from '@/hooks/context/useConfirm'
import { LogOutIcon, PencilIcon, Settings2Icon } from 'lucide-react'

const UserIcon = () => {
  const { ConfirmDialog: LogOutConfirmDialog, Confirmation: logOutConfirmation } = useConfirm({
    title: 'Are you sure that you want to log out?',
    message: "You'd need to Sign in again in order to access your workspaces",
  })
  const { auth, logOut } = useAuth()
  const { setOpenCreateWorkspaceModal } = useCreateWorkspaceModal()

  const handleModal = () => {
    setOpenCreateWorkspaceModal(true)
  }
  const handleLogOut = async () => {
    const ok = await logOutConfirmation()
    if (!ok) {
      return
    }
    logOut()
  }
  return (
    <>
      <LogOutConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none cursor-pointer relative">
          <Avatar className="size-12 hover:opacity-60 transition-opacity border-2 border-[var(--primary-end)]">
            <AvatarImage src={auth?.user?.avatar} />
            <AvatarFallback>{auth?.user?.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="text-slate-300 bg-gradient-to-r from-[#101321] via-[#151827] to-[#121423] border-slate-400/40 border-1">
          <DropdownMenuItem>
            <Settings2Icon className="size-4 mr-1 text-blue-500" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleModal}>
            <PencilIcon className="size-4 mr-1 text-blue-500" />
            Create Workspace
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogOut}>
            <LogOutIcon className="size-4 mr-1 text-red-500" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default UserIcon
