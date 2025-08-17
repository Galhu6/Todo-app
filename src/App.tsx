import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./screens/HomePage/HomePage";
import { DashboardProtection } from "./components/DashboardProtection/DashboardProtection";
import { Dashboard } from "./screens/Dashboard/Dashboard";
import { AuthScreen } from "./screens/AuthScreen/AuthScreen";
import { AppProvider } from "./context/AppContext";

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthScreen />} />
          <Route
            path="/dashboard"
            element={
              <DashboardProtection>
                <Dashboard />
              </DashboardProtection>
            }
          />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
