import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './screens/HomePage/HomePage.js'
import { DashboardProtection } from './components/DashboardProtection/DashboardProtection.js'
import { Dashboard } from './components/Dashboard/Dashboard.js';
import { AuthScreen } from "./screens/AuthScreen/AuthScreen.js";

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
    </Router>
  )
}

export default App
