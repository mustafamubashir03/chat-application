import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import CreateChannelModal from '@/molecules/CreateChannelModal/CreateChannelModal'
import WorkspacePreferencesModal from '@/molecules/WorkspacePreferencesModal/WorkspacePreferencesModal'
import WorkspaceNavbar from '@/organisms/Workspaces/WorkspaceNavbar'
import WorkspacePanel from '@/organisms/Workspaces/WorkspacePanel'
import WorkspaceSidebar from '@/organisms/Workspaces/WorkspaceSidebar'
import type React from 'react'

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-[100vh] overflow-hidden">
      <WorkspaceNavbar />
      <div className="flex h-[calc(100vh-56px)]">
        {/* WorkspaceSidebar handles its own mobile/desktop visibility */}
        <WorkspaceSidebar />
        {/* On mobile: hide the WorkspacePanel; the main content takes full width */}
        <div className="flex flex-1 min-w-0 overflow-hidden">
          <div className="hidden sm:flex sm:w-[220px] lg:w-[260px] shrink-0 bg-[#101325]">
            <WorkspacePanel />
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            {children}
          </div>
        </div>
      </div>
      <CreateChannelModal />
      <WorkspacePreferencesModal />
    </div>
  )
}

export default WorkspaceLayout

