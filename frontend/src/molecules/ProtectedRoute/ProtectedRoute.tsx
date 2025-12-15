import { useAuth } from '@/hooks/context/useAuth'
import type React from 'react'
import { Navigate } from 'react-router-dom'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { auth } = useAuth()
  const { user, isLoading, token } = auth
  if (isLoading) {
    return <div className="text-slate-300">Loading</div>
  }
  if (!user || !token) {
    return <Navigate to="/auth/signin" />
  }
  return <div>{children}</div>
}
