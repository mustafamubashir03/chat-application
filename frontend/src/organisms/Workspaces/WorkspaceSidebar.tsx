import { useState } from 'react'
import UserIcon from '@/atoms/userIcon/UserIcon'
import SidebarButton from '@/molecules/SidebarButton/SidebarButton'
import { BellIcon, HomeIcon, MessageCircleIcon, MoreHorizontalIcon, MenuIcon, XIcon } from 'lucide-react'
import WorkspaceSwitcher from './WorkspaceSwitcher'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useWorkspacePreferences } from '@/hooks/context/useWorkspacePreferences'

const WorkspaceSidebar = () => {
  const navigate = useNavigate()
  const { setOpenPreferences } = useWorkspacePreferences()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleHome = () => {
    navigate('/home')
    setMobileOpen(false)
  }

  const handleNotifications = () => {
    toast.info('No new notifications', { description: 'You are all caught up!' })
    setMobileOpen(false)
  }

  const handleMore = () => {
    setOpenPreferences(true)
    setMobileOpen(false)
  }

  const SidebarContent = () => (
    <div className="h-full flex flex-col gap-y-4 items-center pt-[10px] pb-[max(0.625rem,env(safe-area-inset-bottom))]">
      <WorkspaceSwitcher />
      <SidebarButton Icon={HomeIcon} Label={'Home'} onClick={handleHome} />
      <SidebarButton Icon={MessageCircleIcon} Label={'Message'} />
      <SidebarButton Icon={BellIcon} Label={'Notifications'} onClick={handleNotifications} />
      <SidebarButton Icon={MoreHorizontalIcon} Label={'More'} onClick={handleMore} />
      <div className="flex flex-col items-center justify-center mt-auto">
        <UserIcon />
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar — hidden on mobile */}
      <aside className="hidden sm:block w-[90px] h-full bg-[#0b0d1a] shrink-0">
        <div className="h-[calc(100dvh-40px)]">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile: floating hamburger button */}
      <button
        className="sm:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-[#0b0d1a] border border-slate-700 text-slate-300 hover:text-white shadow-lg"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <MenuIcon className="size-5" />
      </button>

      {/* Mobile: backdrop */}
      {mobileOpen && (
        <div
          className="sm:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile: slide-out drawer */}
      <aside
        className={`sm:hidden fixed top-0 left-0 z-50 h-full w-[90px] bg-[#0b0d1a] border-r border-slate-800 shadow-2xl transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          className="absolute top-3 right-[-36px] p-1.5 rounded-r-lg bg-[#0b0d1a] border border-l-0 border-slate-700 text-slate-400 hover:text-white"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <XIcon className="size-4" />
        </button>
        <div className="h-full">
          <SidebarContent />
        </div>
      </aside>
    </>
  )
}

export default WorkspaceSidebar

