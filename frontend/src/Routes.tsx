import { Route, Routes } from 'react-router-dom'
import SignupContainer from './organisms/Auth/SignupContainer'
import Auth from './pages/auth/Auth'
import SigninContainer from './organisms/Auth/SigninContainer'
import Home from './pages/Home'
import { Notfound } from './pages/Notfound/Notfound'
import { ProtectedRoute } from './molecules/ProtectedRoute/ProtectedRoute'
import WorkspaceLayout from './pages/Workspaces/WorkspaceLayout'
import WorkspaceOptions from './organisms/Workspaces/WorkspaceNavbar'

export const AppRoutes = () => {
  return (
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
            <SigninContainer />
          </Auth>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspace/:workspaceId"
        element={
          <ProtectedRoute>
            <WorkspaceLayout>Hello World</WorkspaceLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/*" element={<Notfound />} />
    </Routes>
  )
}
