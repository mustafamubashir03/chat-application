import { CreateWorkspaceModalContext } from '@/context/createWorkspaceContext'
import { useContext } from 'react'

export const useCreateWorkspaceModal = () => {
  const { openCreateWorkspaceModal, setOpenCreateWorkspaceModal } = useContext(
    CreateWorkspaceModalContext,
  )
  return {
    openCreateWorkspaceModal,
    setOpenCreateWorkspaceModal,
  }
}
