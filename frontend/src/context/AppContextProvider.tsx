import combineContext from '@/utils/combineContext'
import { AuthContextProvider } from './AuthContext'
import WorkspacePreferencesModalContextProvider from './WorkspaceModalContext'
import CreateWorkspaceModalContextProvider from './CreateWorkspaceContext'

export const AppContextProvider = combineContext(
  AuthContextProvider,
  CreateWorkspaceModalContextProvider,
  WorkspacePreferencesModalContextProvider,
)
