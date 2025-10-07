import combineContext from '@/utils/combineContext'
import { AuthContextProvider } from './AuthContext'
import CreateWorkspaceContextProvider from './createWorkspaceContext'

export const AppContextProvider = combineContext(
  AuthContextProvider,
  CreateWorkspaceContextProvider,
)
