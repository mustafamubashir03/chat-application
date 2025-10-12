import { workspacePreferencesModalContext } from '@/context/WorkspaceModalContext'
import { useContext } from 'react'

export const useWorkspacePreferences = () => {
  const { openPreferences, setOpenPreferences, initialValue, setInitialValue } = useContext(
    workspacePreferencesModalContext,
  )
  return {
    openPreferences,
    setOpenPreferences,
    initialValue,
    setInitialValue,

  }
}
