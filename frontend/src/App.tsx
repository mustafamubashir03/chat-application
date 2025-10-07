import './index.css'
import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from './components/ui/sonner'
import { AppContextProvider } from './context/AppContextProvider'
import { AppRoutes } from './Routes'
import CreateWorkspaceModal from './molecules/CreateWorkspaceModal/CreateWorkspaceModal'

function App() {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <AppRoutes />
        <CreateWorkspaceModal/>
        <Toaster position="top-center" />
      </AppContextProvider>
    </QueryClientProvider>
  )
}

export default App
