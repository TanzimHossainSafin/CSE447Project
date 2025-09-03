
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Signin } from './components/signin'
import Signup from './components/signup'
import Dashboard from './components/dashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
