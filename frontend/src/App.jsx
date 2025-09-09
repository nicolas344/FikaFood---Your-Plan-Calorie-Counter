import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegistersPage from './pages/RegistersPage';
import DashboardPage from './pages/DashboardPage';
import ChatbotPage from './pages/ChatbotPage'; // Agregar esta importación
import ProfileSetupPage from './pages/ProfileSetupPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Ruta raíz - redirige según autenticación */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Rutas públicas - solo accesibles si NO está autenticado */}
            <Route path="/login" element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } />
            
            <Route path="/register" element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } />
            
            {/* Rutas protegidas - solo accesibles si está autenticado */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />

            <Route path="/registers" element={
              <ProtectedRoute>
                <RegistersPage />
              </ProtectedRoute>
            } />

            {/* Ruta del chatbot - protegida */}
            <Route path="/chatbot" element={
              <ProtectedRoute>
                <ChatbotPage />
              </ProtectedRoute>
            } />

            <Route path="/profile-setup" element={
              <ProtectedRoute>
                <ProfileSetupPage />
              </ProtectedRoute>
            } />
            
            {/* Ruta 404 */}
            <Route path="*" element={
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-4">Página no encontrada</p>
                  <a href="/dashboard" className="text-blue-600 hover:text-blue-500">
                    Volver al dashboard
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
