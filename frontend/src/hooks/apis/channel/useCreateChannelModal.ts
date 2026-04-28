import { CreateChannelContext } from '@/context/CreateChannelContext'
import { useContext } from 'react'

const useCreateChannelModal = () => {
  const { openCreateChannelModal, setOpenCreateChannelModal } = useContext(CreateChannelContext)
  return {
    openCreateChannelModal,
    setOpenCreateChannelModal,
  }
}

export default useCreateChannelModal
