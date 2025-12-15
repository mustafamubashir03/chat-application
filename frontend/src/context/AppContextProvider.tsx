import combineContext from '@/utils/combineContext'
import { AuthContextProvider } from './AuthContext'
import WorkspacePreferencesModalContextProvider from './WorkspaceModalContext'
import CreateWorkspaceModalContextProvider from './CreateWorkspaceContext'
import { CreateChannelContextProvider } from './CreateChannelContext'
import OpenWorkspacePanelSectionProvider from './OpenWorkspacePanelSection'
import WorkspaceContextProvider from './WorkspaceContext'

export const AppContextProvider = combineContext(
  AuthContextProvider,
  CreateWorkspaceModalContextProvider,
  WorkspacePreferencesModalContextProvider,
  WorkspaceContextProvider,
  CreateChannelContextProvider,
  OpenWorkspacePanelSectionProvider,
)
