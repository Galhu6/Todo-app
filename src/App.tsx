import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './screens/HomePage/HomePage.js'
import { DashboardProtection } from './components/DashboardProtection/DashboardProtection.js'
import { Dashboard } from './screens/Dashboard/Dashboard.js';
import { AuthScreen } from "./screens/AuthScreen/AuthScreen.js";
import { AppProvider } from './context/AppContext.js'

function App() {

  return (
    <AppProvider>
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
    </AppProvider>
  )
}

export default App
