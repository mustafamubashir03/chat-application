import { Route, Routes } from "react-router-dom"
import SignupContainer from "./organisms/Auth/SignupContainer"
import Auth from "./pages/auth/Auth"
import SigninContainer from "./organisms/Auth/SigninContainer"
import { Home } from "lucide-react"
import { Notfound } from "./pages/Notfound/Notfound"

export const AppRoutes = ()=>{
   return <Routes>
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
    <Route path="/home" element={<Home/>} />
    <Route path="/*" element={<Notfound />} />
  </Routes>
}