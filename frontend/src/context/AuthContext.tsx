import React, { createContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

type userType = {
  username: string
  avatar: string
  email: string
}

const initialAuth = {
  user: null as userType | null,
  token: null as string | null,
  isLoading: true,
}

export const AuthContext = createContext<{
  auth: typeof initialAuth
  setAuth: React.Dispatch<React.SetStateAction<typeof initialAuth>>
  logOut: () => void
}>({
  auth: initialAuth,
  setAuth: () => {},
  logOut: () => {},
})

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState(initialAuth)
  const logOut = () => {
    toast('Successfully logged out')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setAuth({
      user: null,
      token: null,
      isLoading: false,
    })
  }

  useEffect(() => {
    const user = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (user && token) {
      setAuth({
        user: JSON.parse(user),
        token: JSON.parse(token),
        isLoading: false,
      })
    } else {
      setAuth((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  return <AuthContext.Provider value={{ auth, setAuth, logOut }}>{children}</AuthContext.Provider>
}

export default AuthContext
