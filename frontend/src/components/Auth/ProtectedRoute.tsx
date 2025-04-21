// ... code before usage example ...

export default ProtectedRoute;

/*
Usage Example (with react-router-dom v6):

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';         // Assuming these pages exist
import DashboardPage from './pages/DashboardPage';   // Assuming these pages exist
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext'; // Assuming AuthProvider path

function AppRoutes() { // Renamed from App to avoid conflict if App.tsx is main layout
  return (
    <BrowserRouter>
      <AuthProvider> {/* Ensure AuthProvider wraps your routes */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}> {/* Wrap protected routes */}
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* Other protected routes go here */}
          </Route>

          {/* Other public routes go here */}
          {/* Example: <Route path="/" element={<HomePage />} /> */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
*/
