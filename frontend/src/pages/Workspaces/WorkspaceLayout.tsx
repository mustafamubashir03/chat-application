import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import CreateChannelModal from '@/molecules/CreateChannelModal/CreateChannelModal'
import WorkspacePreferencesModal from '@/molecules/WorkspacePreferencesModal/WorkspacePreferencesModal'
import WorkspaceNavbar from '@/organisms/Workspaces/WorkspaceNavbar'
import WorkspacePanel from '@/organisms/Workspaces/WorkspacePanel'
import WorkspaceSidebar from '@/organisms/Workspaces/WorkspaceSidebar'
import { useEffect, useState } from 'react'
import type React from 'react'

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
  // Restore the original draggable pane: on sm+ screens the workspace list is
  // a resizable panel with a drag handle (as before the "responsive" commit).
  // Below 640px it stays collapsed: the panel is skipped and the chat fills
  // the full width, exactly like the current mobile behavior.
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 640px)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)')
    const onViewportChange = () => setIsDesktop(mq.matches)
    mq.addEventListener('change', onViewportChange)
    return () => mq.removeEventListener('change', onViewportChange)
  }, [])

  return (
    <div className="h-[100dvh] overflow-hidden">
      <WorkspaceNavbar />
      <div className="flex h-[calc(100dvh-56px)] min-h-0">
        {/* WorkspaceSidebar handles its own mobile/desktop visibility */}
        <WorkspaceSidebar />
        {isDesktop ? (
          <ResizablePanelGroup
            autoSaveId="workspaceId"
            direction="horizontal"
            className="flex-1 min-w-0 min-h-0"
          >
            <ResizablePanel
              defaultSize={20}
              minSize={11}
              maxSize={45}
              className="min-h-0 overflow-hidden"
            >
              <div className="h-full w-full bg-[#101325]">
                <WorkspacePanel />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel minSize={20} className="min-h-0 min-w-0 overflow-hidden">
              {children}
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="flex-1 min-w-0 overflow-hidden">{children}</div>
        )}
      </div>
      <CreateChannelModal />
      <WorkspacePreferencesModal />
    </div>
  )
}

export default WorkspaceLayout