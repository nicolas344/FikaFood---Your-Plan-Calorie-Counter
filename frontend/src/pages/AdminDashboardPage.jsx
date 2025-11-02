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
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-t-4 border-green-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl">🍽️</span>
          </div>
        </div>
        <p className="mt-4 text-lg font-semibold text-green-700">Cargando panel de administración...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header con glassmorphism */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center py-6 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Panel de Administración
              </h1>
              <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Bienvenido, {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                </svg>
                Administrador
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
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
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
          {/* Tabs Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-2 px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-shrink-0 py-4 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 rounded-t-lg ${
                    activeTab === tab.key
                      ? 'border-green-500 text-green-700 bg-green-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  title={tab.description}
                >
                  <span className="mr-2 text-lg">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {renderContent()}
          </div>
        </div>
        
        {/* Footer informativo */}
        <div className="mt-8 text-center text-sm text-gray-600 space-y-2">
          <p className="font-semibold">Panel de Administración FikaFood • Versión 1.0</p>
          <p className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            Gestiona tu aplicación de manera segura y eficiente
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;