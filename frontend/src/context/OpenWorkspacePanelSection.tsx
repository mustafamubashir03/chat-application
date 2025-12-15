import React, { createContext, useState } from 'react'

export const OpenWorkspacePanelSectionContext = createContext<{
  openChannelPanelSection: boolean
  setOpenChannelPanelSection: React.Dispatch<React.SetStateAction<boolean>>
}>({ openChannelPanelSection: false, setOpenChannelPanelSection: () => {} })
const OpenWorkspacePanelSectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [openChannelPanelSection, setOpenChannelPanelSection] = useState(false)
  return (
    <OpenWorkspacePanelSectionContext.Provider
      value={{ openChannelPanelSection, setOpenChannelPanelSection }}
    >
      {children}
    </OpenWorkspacePanelSectionContext.Provider>
  )
}

export default OpenWorkspacePanelSectionProvider
