import WorkspaceSidebar from '@/organisms/Workspaces/WorkspaceSidebar'
import type React from 'react'

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-[100vh]">
      <div className="flex h-full">
        <WorkspaceSidebar />
        {children}
      </div>
    </div>
  )
}

export default WorkspaceLayout
