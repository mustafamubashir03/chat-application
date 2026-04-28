
import React, { createContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

type userType = {
  id: string
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
  setAuth: () => { },
  logOut: () => { },
})

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState(initialAuth)
  const logOut = async () => {
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
    const userStr = localStorage.getItem('user')
    const tokenStr = localStorage.getItem('token')

    const isTokenExpired = (token: string) => {
      if (!token) return true
      try {
        const payloadBase64 = token.split('.')[1]
        const decodedJson = atob(payloadBase64)
        const decoded = JSON.parse(decodedJson)
        const exp = decoded.exp
        if (!exp) return false
        return exp * 1000 < Date.now()
      } catch (error) {
        return true
      }
    }

    if (userStr && tokenStr) {
      try {
        const user = JSON.parse(userStr)
        const token = JSON.parse(tokenStr)

        if (isTokenExpired(token)) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setAuth((prev) => ({ ...prev, isLoading: false }))
        } else {
          setAuth({
            user,
            token,
            isLoading: false,
          })
        }
      } catch (e) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setAuth((prev) => ({ ...prev, isLoading: false }))
      }
    } else {
      setAuth((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  return <AuthContext.Provider value={{ auth, setAuth, logOut }}>{children}</AuthContext.Provider>
}

export default AuthContext
