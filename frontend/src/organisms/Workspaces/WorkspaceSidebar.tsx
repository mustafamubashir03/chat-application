import UserIcon from '@/atoms/userIcon/UserIcon'
import SidebarButton from '@/molecules/SidebarButton/SidebarButton'
import { BellIcon, HomeIcon, MessageCircleIcon, MoreHorizontalIcon } from 'lucide-react'
import WorkspaceSwitcher from './WorkspaceSwitcher'

const WorkspaceSidebar = () => {
  return (
    <aside className="w-[90px] h-full bg-[#0b0d1a]">
      <div className="h-[calc(100vh-40px)] flex flex-col gap-y-4 items-center pt-[10px] pb-[5px]">
        <WorkspaceSwitcher />
        <SidebarButton Icon={HomeIcon} Label={'Home'} />
        <SidebarButton Icon={MessageCircleIcon} Label={'Message'} />
        <SidebarButton Icon={BellIcon} Label={'Notifications'} />
        <SidebarButton Icon={MoreHorizontalIcon} Label={'More'} />
        <div className="flex flex-col items-center justify-center mt-auto">
          <UserIcon />
        </div>
      </div>
    </aside>
  )
}

export default WorkspaceSidebar
