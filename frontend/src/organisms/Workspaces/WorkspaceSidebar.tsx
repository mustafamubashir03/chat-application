import UserIcon from '@/atoms/userIcon/UserIcon'
import SidebarButton from '@/molecules/SidebarButton/SidebarButton'
import { BellIcon, HomeIcon, MessageCircleIcon, MoreHorizontalIcon } from 'lucide-react'

const WorkspaceSidebar = () => {
  return (
    <aside className="w-[70px] h-full bg-[#090c1a]">
      <div className="h-[calc(100vh-40px)] flex flex-col gap-y-4 items-center pt-[10px] pb-[5px]">
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
