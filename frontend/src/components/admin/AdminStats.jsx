import React from 'react';
import { useTranslation } from 'react-i18next';

const AdminStats = ({ stats, onRefresh }) => {
  const { t } = useTranslation();
  if (!stats) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-t-4 border-green-500 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
          <p className="mt-4 text-gray-700 font-medium">{t('admin.stats.loading')}</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: t('admin.stats.totalUsers'),
      value: stats.total_users,
      icon: '👥',
      color: 'bg-gradient-to-br from-green-500 to-emerald-600',
      change: stats.users_change,
    },
    {
      title: t('admin.stats.mealPlans'),
      value: stats.total_meal_plans,
      icon: '🍽️',
      color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      change: stats.meal_plans_change,
    },
    {
      title: t('admin.stats.registersToday'),
      value: stats.registers_today,
      icon: '📝',
      color: 'bg-gradient-to-br from-teal-500 to-cyan-600',
      change: stats.registers_change,
    },
    {
      title: t('admin.stats.conversations'),
      value: stats.total_conversations,
      icon: '💬',
      color: 'bg-gradient-to-br from-lime-500 to-green-600',
      change: stats.conversations_change,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
            {t('admin.stats.title')}
          </h2>
          <p className="text-sm text-gray-600 mt-1">{t('admin.stats.subtitle')}</p>
        </div>
        <button
          onClick={onRefresh}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {t('admin.refresh')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white/90 backdrop-blur overflow-hidden shadow-lg rounded-2xl border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-shrink-0">
                  <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <span className="text-white text-2xl">{stat.icon}</span>
                  </div>
                </div>
                <div className="flex-1 ml-5 text-right">
                  <p className="text-sm font-medium text-gray-500 truncate">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-extrabold text-gray-900 mt-1">
                    {stat.value?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>
            {stat.change !== undefined && (
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-3 border-t border-gray-200">
                <div className="text-sm flex items-center justify-between">
                  <span className={`font-semibold flex items-center gap-1 ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change >= 0 ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    )}
                    {stat.change >= 0 ? '+' : ''}{stat.change}%
                  </span>
                  <span className="text-gray-500 text-xs">{t('admin.stats.vsPreviousMonth')}</span>
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
              {t('admin.stats.recentActiveUsers')}
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
              {t('admin.stats.systemActivity')}
            </h3>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('admin.stats.registersOfToday')}</span>
                <span className="text-sm font-medium">{stats.registers_today}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('admin.stats.newUsersThisWeek')}</span>
                <span className="text-sm font-medium">{stats.new_users_week}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('admin.stats.plansGeneratedToday')}</span>
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
