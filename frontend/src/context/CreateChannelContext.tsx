import { createContext, useState } from 'react'

export const CreateChannelContext = createContext<{
  openCreateChannelModal: boolean
  setOpenCreateChannelModal: React.Dispatch<React.SetStateAction<boolean>>
}>({ openCreateChannelModal: false, setOpenCreateChannelModal: () => {} })

export const CreateChannelContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [openCreateChannelModal, setOpenCreateChannelModal] = useState(false)
  return (
    <CreateChannelContext.Provider value={{ openCreateChannelModal, setOpenCreateChannelModal }}>
      {children}
    </CreateChannelContext.Provider>
  )
}
