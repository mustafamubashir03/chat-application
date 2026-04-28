import { WorkspaceContext } from '@/context/WorkspaceContext'
import { useContext } from 'react'

export const useCurrentWorkspace = () => {
  const { currentWorkspace, setCurrentWorkspace } = useContext(WorkspaceContext)
  return {
    currentWorkspace,
    setCurrentWorkspace,
  }
}
