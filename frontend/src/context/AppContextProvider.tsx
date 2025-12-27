import combineContext from '@/utils/combineContext'
import { AuthContextProvider } from './AuthContext'
import WorkspacePreferencesModalContextProvider from './WorkspaceModalContext'
import CreateWorkspaceModalContextProvider from './CreateWorkspaceContext'
import { CreateChannelContextProvider } from './CreateChannelContext'
import OpenWorkspacePanelSectionProvider from './OpenWorkspacePanelSection'
import WorkspaceContextProvider from './WorkspaceContext'
import { SocketContextProvider } from './SocketContextProvider'

export const AppContextProvider = combineContext(
  SocketContextProvider,
  AuthContextProvider,
  CreateWorkspaceModalContextProvider,
  WorkspacePreferencesModalContextProvider,
  WorkspaceContextProvider,
  CreateChannelContextProvider,
  OpenWorkspacePanelSectionProvider,
)
