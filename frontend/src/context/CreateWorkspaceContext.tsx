import { createContext, useState } from 'react'

export const CreateWorkspaceModalContext = createContext<{
  openCreateWorkspaceModal: boolean
  setOpenCreateWorkspaceModal: React.Dispatch<React.SetStateAction<boolean>>
}>({ openCreateWorkspaceModal: false, setOpenCreateWorkspaceModal: () => {} })
const CreateWorkspaceModalContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [openCreateWorkspaceModal, setOpenCreateWorkspaceModal] = useState(false)
  return (
    <CreateWorkspaceModalContext.Provider
      value={{ openCreateWorkspaceModal, setOpenCreateWorkspaceModal }}
    >
      {children}
    </CreateWorkspaceModalContext.Provider>
  )
}

export default CreateWorkspaceModalContextProvider
