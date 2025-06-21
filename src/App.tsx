import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './screens/HomePage/HomePage'
import { DashboardProtection } from './components/DashboardProtection/DashboardProtection'
import { Dashboard } from './components/Dashboard/Dashboard';
import { AuthScreen } from "./screens/AuthScreen/AuthScreen";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/dashboard" element={
          <DashboardProtection>
            <Dashboard />

          </DashboardProtection>
        } />
      </Routes>
      <HomePage />
    </Router>
  )
}

export default App
