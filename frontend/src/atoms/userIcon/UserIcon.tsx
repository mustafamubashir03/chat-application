import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/context/useAuth'
import { LogOutIcon } from 'lucide-react'

const UserIcon = () => {
  const { auth, logOut } = useAuth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none cursor-pointer relative">
        <Avatar className="size-10 hover:opacity-60 transition-opacity border-2 border-[var(--primary-end)]">
          <AvatarImage src={auth?.user?.avatar} />
          <AvatarFallback>{auth?.user?.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-slate-300 bg-gradient-to-r from-[#101321] via-[#151827] to-[#121423] border-none">
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem onClick={logOut}>
          <LogOutIcon className="size-4 mr-1" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserIcon
