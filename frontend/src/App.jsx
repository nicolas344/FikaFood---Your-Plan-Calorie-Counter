import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegistersPage from './pages/RegistersPage';
import DashboardPage from './pages/DashboardPage';
import ChatbotPage from './pages/ChatbotPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';
import './App.css'
import MealPlanPage from "./pages/MealPlanPage.jsx";
import ApiProducts from "./pages/ApiProducts.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="App">
      <Routes>
          <Route path="/ApiProducts" element={<ApiProducts />} />
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

        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        
        {/* Ruta de los Planes Alimenticios - protegida */}
        <Route path="/mealplan" element={
          <ProtectedRoute>
            <MealPlanPage />
          </ProtectedRoute>
        } />

        {/* Ruta del panel de administración - solo para superusuarios */}
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute>
              {user?.is_superuser ? (
                <AdminDashboardPage />
              ) : (
                <Navigate to="/dashboard" replace />
              )}
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('notFound.title')}</h1>
              <p className="text-gray-600 mb-4">{t('notFound.message')}</p>
              <a href="/dashboard" className="text-blue-600 hover:text-blue-500">
                {t('notFound.backToDashboard')}
              </a>
            </div>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;
