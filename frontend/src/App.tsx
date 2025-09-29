import { Route, Routes } from 'react-router-dom'
import './index.css'
import './App.css'
import Auth from './pages/auth/Auth'

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
    </Routes>
  )
}

export default App
