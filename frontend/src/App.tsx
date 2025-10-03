import { Route, Routes } from 'react-router-dom'
import './index.css'
import './App.css'
import Auth from './pages/auth/Auth'
import { SigninCard } from './organisms/Auth/SigninCard'
import { Notfound } from './pages/auth/Notfound/Notfound'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import SignupContainer from './organisms/Auth/SignupContainer'
import { Toaster } from './components/ui/sonner'

function App() {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route
          path="/auth/signup"
          element={
            <Auth>
              <SignupContainer />
            </Auth>
          }
        />
        <Route
          path="/auth/signin"
          element={
            <Auth>
              <SigninCard />
            </Auth>
          }
        />
        <Route path="/*" element={<Notfound />} />
      </Routes>
      <Toaster position="top-center" />
    </QueryClientProvider>
  )
}

export default App
