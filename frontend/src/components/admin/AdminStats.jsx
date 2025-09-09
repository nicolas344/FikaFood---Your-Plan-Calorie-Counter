import React from 'react';

const AdminStats = ({ stats, onRefresh }) => {
  if (!stats) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Usuarios',
      value: stats.total_users,
      icon: '👥',
      color: 'bg-blue-500',
      change: stats.users_change,
    },
    {
      title: 'Planes de Comida',
      value: stats.total_meal_plans,
      icon: '🍽️',
      color: 'bg-green-500',
      change: stats.meal_plans_change,
    },
    {
      title: 'Registros Hoy',
      value: stats.registers_today,
      icon: '📝',
      color: 'bg-yellow-500',
      change: stats.registers_change,
    },
    {
      title: 'Conversaciones',
      value: stats.total_conversations,
      icon: '💬',
      color: 'bg-purple-500',
      change: stats.conversations_change,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Estadísticas del Sistema</h2>
          <p className="text-sm text-gray-600 mt-1">Resumen completo de la actividad en FikaFood</p>
        </div>
        <button
          onClick={onRefresh}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white overflow-hidden shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center shadow-md`}>
                    <span className="text-white text-lg">{stat.icon}</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.title}
                    </dt>
                    <dd>
                      <div className="text-2xl font-bold text-gray-900">
                        {stat.value?.toLocaleString() || 0}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            {stat.change !== undefined && (
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                <div className="text-sm">
                  <span className={`font-medium ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change >= 0 ? '+' : ''}{stat.change}%
                  </span>
                  <span className="text-gray-500"> vs mes anterior</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Usuarios Activos Recientes
            </h3>
            <div className="mt-4">
              {stats.recent_users?.map((user, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">{user.email}</span>
                  <span className="text-xs text-gray-400">{user.last_login}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Actividad del Sistema
            </h3>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Registros de hoy</span>
                <span className="text-sm font-medium">{stats.registers_today}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Nuevos usuarios esta semana</span>
                <span className="text-sm font-medium">{stats.new_users_week}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Planes generados hoy</span>
                <span className="text-sm font-medium">{stats.meal_plans_today}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
