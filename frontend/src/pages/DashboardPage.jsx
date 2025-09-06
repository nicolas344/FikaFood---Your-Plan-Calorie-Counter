import { useState, useEffect } from 'react';
import { LogOut, User, Settings, TrendingUp, Target, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">FikaFood</h1>
              <p className="text-sm text-gray-600">Tu plan de calorías personalizado</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={() => setError(null)} />
          </div>
        )}

        {/* Bienvenida */}
        <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Bienvenido, {user?.first_name}! 👋
            </h2>
            <p className="text-gray-600">
              Aquí puedes ver tu progreso y gestionar tu plan de calorías personalizado.
            </p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* BMR */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Metabolismo Basal
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {dashboardData?.stats?.bmr ? `${dashboardData.stats.bmr} cal/día` : 'No calculado'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Meta de calorías */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Meta Diaria
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {dashboardData?.stats?.daily_goal ? `${dashboardData.stats.daily_goal} cal` : 'No definida'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Peso */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Peso Actual
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {user?.weight ? `${user.weight} kg` : 'No registrado'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Altura */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <User className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Altura
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {user?.height ? `${user.height} cm` : 'No registrada'}
                    </dd>
                  </dl>
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
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            🚀 Próximamente
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <ul className="space-y-1">
              <li>• Registro de comidas diarias</li>
              <li>• Base de datos de alimentos</li>
              <li>• Seguimiento de calorías</li>
            </ul>
            <ul className="space-y-1">
              <li>• Planes de alimentación personalizados</li>
              <li>• Gráficos de progreso</li>
              <li>• Recomendaciones nutricionales</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
