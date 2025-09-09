import { useState, useEffect } from 'react';
import { LogOut, User, Settings, TrendingUp, Target, Activity, Camera,Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import DailySummary from '../components/registers/DailySummary';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  // Agregar dateFilter por defecto para el dashboard
  const [dateFilter] = useState({ period: 'today' });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const result = await authService.getDashboard();
        if (result.success) {
          setDashboardData(result.data);
        } else {
          setError('Error al cargar el dashboard');
        }
      } catch (err) {
        setError('Error de conexión');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">FikaFood</h1>
              <p className="text-xs text-gray-600">Tu plan de calorías personalizado</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/registers"
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center transition-colors"
              >
                <Camera className="w-4 h-4 mr-1" />
                Registrar
              </Link>
              
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-2 transition-colors hidden md:flex border border-transparent hover:border-gray-200 group"
              >
                <div className="relative">
                  <User className="w-8 h-8 text-gray-500 bg-gray-100 rounded-full p-1 group-hover:text-blue-600 transition-colors" />
                 </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{user?.first_name}</p>
                  <p className="text-xs text-gray-500 group-hover:text-blue-500 transition-colors">Ver perfil</p>
                </div>
              </button>

              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center px-2 py-1"
              >
                <LogOut className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Salir</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4">
            <Alert type="error" message={error} onClose={() => setError(null)} />
          </div>
        )}

        {/* Contenido principal en grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Columna izquierda - Bienvenida y Quick Actions */}
          <div className="lg:col-span-1 space-y-4">
            {/* Bienvenida compacta */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                ¡Hola, {user?.first_name}! 👋
              </h2>
              <p className="text-sm text-gray-600">
                Gestiona tu plan nutricional
              </p>
            </div>

            {/* Quick Actions compactas */}
            <div className="space-y-2">
              <button
                onClick={() => navigate('/registers')}
                className="w-full p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow border-l-4 border-green-500"
              >
                <div className="flex items-center">
                  <Camera className="w-5 h-5 text-green-500 mr-3" />
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900 text-sm">Registrar Comida</h3>
                    <p className="text-xs text-gray-600">Analiza con IA</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/chatbot')}
                className="w-full p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow border-l-4 border-blue-500"
              >
                <div className="flex items-center">
                  <MessageCircle className="w-5 h-5 text-blue-500 mr-3" />
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900 text-sm">Asistente IA</h3>
                    <p className="text-xs text-gray-600">Consulta nutricional</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/registers')}
                className="w-full p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow border-l-4 border-purple-500"
              >
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-purple-500 mr-3" />
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900 text-sm">Ver Registros</h3>
                    <p className="text-xs text-gray-600">Historial completo</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Columna central y derecha - Resumen diario y estadísticas */}
          <div className="lg:col-span-2 space-y-4">
            {/* Resumen diario */}
            <DailySummary 
              refreshTrigger={refreshTrigger} 
              dateFilter={dateFilter}
            />

            {/* Estadísticas del usuario en grid compacto */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {/* BMR */}
              <div className="bg-white rounded-lg shadow p-3">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <dt className="text-xs font-medium text-gray-500">BMR</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {dashboardData?.stats?.bmr ? `${dashboardData.stats.bmr}` : 'N/A'}
                    </dd>
                  </div>
                </div>
              </div>

              {/* Meta de calorías */}
              <div className="bg-white rounded-lg shadow p-3">
                <div className="flex items-center">
                  <Target className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <dt className="text-xs font-medium text-gray-500">Meta</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {dashboardData?.stats?.daily_goal ? `${dashboardData.stats.daily_goal}` : 'N/A'}
                    </dd>
                  </div>
                </div>
              </div>

              {/* Peso */}
              <div className="bg-white rounded-lg shadow p-3">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 text-purple-600 mr-2" />
                  <div>
                    <dt className="text-xs font-medium text-gray-500">Peso</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {user?.weight ? `${user.weight} kg` : 'N/A'}
                    </dd>
                  </div>
                </div>
              </div>

              {/* Altura */}
              <div className="bg-white rounded-lg shadow p-3">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-orange-600 mr-2" />
                  <div>
                    <dt className="text-xs font-medium text-gray-500">Altura</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {user?.height ? `${user.height} cm` : 'N/A'}
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Perfil del usuario */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Información del Perfil
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Detalles de tu cuenta y configuración personal.
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Nombre completo</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user?.full_name}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user?.email}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Nombre de usuario</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user?.username}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Nivel de actividad</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user?.activity_level === 'sedentary' && 'Sedentario'}
                  {user?.activity_level === 'light' && 'Actividad ligera'}
                  {user?.activity_level === 'moderate' && 'Actividad moderada'}
                  {user?.activity_level === 'active' && 'Muy activo'}
                  {user?.activity_level === 'extra' && 'Extra activo'}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Fecha de registro</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : 'No disponible'}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Próximas funcionalidades */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-green-900 mb-2 flex items-center">
            <Camera className="w-5 h-5 mr-2" />
            ¡Nueva Funcionalidad Disponible!
          </h3>
          <div className="text-sm text-green-700 mb-4">
            <p>Ya puedes registrar tus comidas y obtener análisis nutricional automático con IA.</p>
          </div>
          <Link
            to="/registers"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Camera className="w-4 h-4 mr-2" />
            Registrar mi primera comida
          </Link>
        </div>

        {/* Botón del Chatbot */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate('/chatbot')}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Asistente Nutricional
          </button>
        </div>

        {/* Quick Actions - Agregar el chatbot aquí también */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/register')}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-500"
          >
            <div className="flex items-center">
              <Camera className="w-6 h-6 text-green-500 mr-3" />
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Registrar Comida</h3>
                <p className="text-sm text-gray-600">Analiza tu comida con IA</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/chatbot')}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500"
          >
            <div className="flex items-center">
              <MessageCircle className="w-6 h-6 text-blue-500 mr-3" />
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Asistente IA</h3>
                <p className="text-sm text-gray-600">Pregunta al experto nutricional</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/registers')}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-purple-500"
          >
            <div className="flex items-center">
              <TrendingUp className="w-6 h-6 text-purple-500 mr-3" />
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Ver Registros</h3>
                <p className="text-sm text-gray-600">Historial de comidas</p>
              </div>
            </div>
          </button>
            <button
            onClick={() => navigate('/MealPlan')}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-red-500"
          >
            <div className="flex items-center">
              <Crown className="w-6 h-6 text-red-500 mr-3" />
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Planes Alimenticios</h3>
                <p className="text-sm text-gray-600">Genera y gestiona tus planes alimenticios</p>
              </div>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
