import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import AdminStats from '../components/admin/AdminStats';
import AdminUsersList from '../components/admin/AdminUsersList';
import AdminMealPlansList from '../components/admin/AdminMealPlansList';
import AdminRegistersList from '../components/admin/AdminRegistersList';
import AdminConversationsList from '../components/admin/AdminConversationsList';

const AdminDashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const response = await adminService.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      try {
        await logout();
        navigate('/login');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
  };

  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊', description: 'Estadísticas generales' },
    { key: 'users', label: 'Usuarios', icon: '👥', description: 'Gestión de usuarios' },
    { key: 'meal-plans', label: 'Planes de Comida', icon: '🍽️', description: 'Planes alimenticios' },
    { key: 'registers', label: 'Registros', icon: '📝', description: 'Registros de alimentos' },
    { key: 'conversations', label: 'Conversaciones', icon: '💬', description: 'Chatbot' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminStats stats={stats} onRefresh={loadDashboardStats} />;
      case 'users':
        return <AdminUsersList />;
      case 'meal-plans':
        return <AdminMealPlansList />;
      case 'registers':
        return <AdminRegistersList />;
      case 'conversations':
        return <AdminConversationsList />;
      default:
        return <AdminStats stats={stats} onRefresh={loadDashboardStats} />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="text-sm text-gray-600 mt-1">Bienvenido, {user?.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                🔑 Administrador
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-shrink-0 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  title={tab.description}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {renderContent()}
          </div>
        </div>
        
        {/* Footer informativo */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Panel de Administración FikaFood • Versión 1.0</p>
          <p className="mt-1">Gestiona tu aplicación de manera segura y eficiente</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;