import { Route, Routes, Navigate, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import SignupContainer from './organisms/Auth/SignupContainer'
import Auth from './pages/auth/Auth'
import SigninContainer from './organisms/Auth/SigninContainer'
import Home from './pages/Home'
import { Notfound } from './pages/Notfound/Notfound'
import { ProtectedRoute } from './molecules/ProtectedRoute/ProtectedRoute'
import WorkspaceLayout from './pages/Workspaces/WorkspaceLayout'
import JoinPage from './pages/Workspaces/JoinPage'
import Channel from './pages/Workspaces/Channels/Channel'
import AuthContext from './context/AuthContext'

export const AppRoutes = () => {
  const { auth } = useContext(AuthContext)
  const location = useLocation()

  // user is considered logged in if auth.user exists
  const isLoggedIn = !!auth.user

  return (
    <Routes>
      {/* Base URL "/" */}
      <Route
        path="/"
        element={
          isLoggedIn ? (
            <Navigate to="/home" replace />
          ) : (
            <Navigate to="/auth/signin" replace />
          )
        }
      />

      {/* Auth Routes */}
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

      {/* Home */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* Workspaces */}
      <Route
        path="/workspace/join/:workspaceId"
        element={
          <ProtectedRoute>
            <JoinPage />
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
      <Route
        path="/workspace/:workspaceId/channels/:channelId"
        element={
          <ProtectedRoute>
            <WorkspaceLayout>
              <Channel />
            </WorkspaceLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all unknown routes */}
      <Route
        path="/*"
        element={
          isLoggedIn ? (
            <Notfound />
          ) : (
            <Navigate to="/auth/signin" replace state={{ from: location }} />
          )
        }
      />
    </Routes>
  )
}
