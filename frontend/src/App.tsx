import { Route, Routes } from 'react-router-dom'
import './index.css'
import './App.css'
import Auth from './pages/auth/Auth'
import { SignupCard } from './organisms/Auth/SignupCard'
import { SigninCard } from './organisms/Auth/SigninCard'
import { Notfound } from './pages/auth/Notfound/Notfound'

function App() {
  return (
    <Routes>
      <Route path="/auth/signup" element={<Auth><SignupCard/></Auth>} />
      <Route path="/auth/signin" element={<Auth><SigninCard/></Auth>} />
      <Route path='/*' element={<Notfound/>}/>
    </Routes>
  )
}

export default App
