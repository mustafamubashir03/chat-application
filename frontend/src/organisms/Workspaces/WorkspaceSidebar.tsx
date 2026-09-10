import { useEffect, useState } from 'react'
import UserIcon from '@/atoms/userIcon/UserIcon'
import SidebarButton from '@/molecules/SidebarButton/SidebarButton'
import { BellIcon, HomeIcon, MessageCircleIcon, MoreHorizontalIcon, MenuIcon, XIcon } from 'lucide-react'
import WorkspaceSwitcher from './WorkspaceSwitcher'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useWorkspacePreferences } from '@/hooks/context/useWorkspacePreferences'
import WorkspacePanel from './WorkspacePanel'

const WorkspaceSidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { setOpenPreferences } = useWorkspacePreferences()
  const [mobileOpen, setMobileOpen] = useState(false)
  const inWorkspace = !!workspaceId

  // Closing the drawer the moment the route changes lets the user tap a
  // channel/member in the mobile panel and land straight into the conversation.
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

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
      {mobileOpen && (
        <aside
          className={`sm:hidden fixed top-0 left-0 z-50 h-full bg-[#0b0d1a] shadow-2xl transition-transform duration-300 flex ${
            inWorkspace ? 'w-[min(370px,94vw)]' : 'w-[90px]'
          }`}
        >
          <div className="w-[90px] shrink-0 h-full">
            <SidebarContent />
          </div>
          {inWorkspace && (
            <div className="flex-1 min-w-0 h-full bg-[#101325] border-l border-slate-800 flex flex-col">
              <div className="shrink-0 flex items-center justify-between px-3 py-2 border-b border-slate-700/60">
                <span className="text-sm font-semibold text-slate-300">Channels & DMs</span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
                  aria-label="Close menu"
                >
                  <XIcon className="size-4" />
                </button>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto chat-scroll">
                <WorkspacePanel />
              </div>
            </div>
          )}
        </aside>
      )}
    </>
  )
}

export default WorkspaceSidebar