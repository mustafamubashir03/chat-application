import React, { createContext, useState } from 'react'
export const WorkspaceContext = createContext<{
  currentWorkspace: any
  setCurrentWorkspace: React.Dispatch<React.SetStateAction<any>>
}>({ currentWorkspace: '', setCurrentWorkspace: () => {} })

const WorkspaceContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentWorkspace, setCurrentWorkspace] = useState(null)
  return (
    <WorkspaceContext.Provider value={{ currentWorkspace, setCurrentWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export default WorkspaceContextProvider
