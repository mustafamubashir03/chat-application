import { OpenWorkspacePanelSectionContext } from '@/context/OpenWorkspacePanelSection'
import { useContext } from 'react'

export const useOpenWorkspacePanelSection = () => {
  const { openChannelPanelSection, setOpenChannelPanelSection } = useContext(
    OpenWorkspacePanelSectionContext,
  )
  return {
    openChannelPanelSection,
    setOpenChannelPanelSection,
  }
}
