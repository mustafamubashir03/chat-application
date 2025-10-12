import { useGetWorkspaceById } from '@/hooks/apis/workspace/useGetWorkspaceById'
import { createContext, useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { useParams } from 'react-router-dom'

export const workspacePreferencesModalContext = createContext<{
  openPreferences: boolean
  setOpenPreferences: Dispatch<SetStateAction<boolean>>
  initialValue: string
  setInitialValue: Dispatch<SetStateAction<any>>
}>({
  openPreferences: false,
  setOpenPreferences: () => {},
  initialValue: 'Edit Workspace',
  setInitialValue: () => {},
})

const WorkspacePreferencesModalContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [openPreferences, setOpenPreferences] = useState(false)
  const [initialValue, setInitialValue] = useState('Edit Workspace')
  return (
    <workspacePreferencesModalContext.Provider
      value={{ openPreferences, setOpenPreferences, initialValue, setInitialValue }}
    >
      {children}
    </workspacePreferencesModalContext.Provider>
  )
}

export default WorkspacePreferencesModalContextProvider
