import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import WorkspacePreferencesModal from '@/molecules/WorkspacePreferencesModal/WorkspacePreferencesModal'
import WorkspaceNavbar from '@/organisms/Workspaces/WorkspaceNavbar'
import WorkspacePanel from '@/organisms/Workspaces/WorkspacePanel'
import WorkspaceSidebar from '@/organisms/Workspaces/WorkspaceSidebar'
import type React from 'react'

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-[100vh]">
      <WorkspaceNavbar />
      <div className="flex h-[calc(100vh-28px)]">
        <WorkspaceSidebar />
        <ResizablePanelGroup autoSaveId={'workspaceId'} direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={11} className="bg-[#080a15]">
            <WorkspacePanel />
          </ResizablePanel>
          <ResizableHandle withHandle className="bg-[#0000000]" />
          <ResizablePanel minSize={20}>{children}</ResizablePanel>
        </ResizablePanelGroup>
        {children}
      </div>
      <WorkspacePreferencesModal />
    </div>
  )
}

export default WorkspaceLayout
