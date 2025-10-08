import WorkspaceNavbar from '@/organisms/Workspaces/WorkspaceNavbar'
import WorkspaceSidebar from '@/organisms/Workspaces/WorkspaceSidebar'
import type React from 'react'

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-[100vh]">
      <WorkspaceNavbar />
      <div className="flex h-[calc(100vh-28px)]">
        <WorkspaceSidebar />
        {children}
      </div>
    </div>
  )
}

export default WorkspaceLayout
