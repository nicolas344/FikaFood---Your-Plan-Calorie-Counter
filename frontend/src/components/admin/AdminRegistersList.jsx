import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { adminService } from '../../services/adminService';

const AdminRegistersList = () => {
  const { t } = useTranslation();
  const [registers, setRegisters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRegisters();
  }, []);

  const loadRegisters = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllRegisters();
      setRegisters(response.data.results || response.data);
    } catch (error) {
      console.error('Error loading registers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRegister = async (registerId) => {
    if (window.confirm(t('admin.registers.confirmDelete'))) {
      try {
        await adminService.deleteRegister(registerId);
        loadRegisters();
      } catch (error) {
        console.error('Error deleting register:', error);
        alert(t('admin.registers.errorDeleting'));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-t-4 border-green-500 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
          </div>
          <p className="mt-4 text-gray-700 font-medium">{t('admin.registers.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
            {t('admin.registers.title')}
          </h2>
          <p className="text-sm text-gray-600 mt-1">{t('admin.registers.subtitle')}</p>
        </div>
        <button
          onClick={loadRegisters}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {t('admin.refresh')}
        </button>
      </div>

      {registers.length === 0 ? (
        <div className="text-center py-16 bg-white/90 backdrop-blur rounded-2xl border border-gray-200">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <p className="text-gray-500 text-lg font-medium">{t('admin.registers.noRegisters')}</p>
          <p className="text-gray-400 text-sm mt-1">{t('admin.registers.noRegistersSubtitle')}</p>
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur shadow-lg overflow-hidden rounded-2xl border border-gray-200">
          <ul className="divide-y divide-gray-200">
            {registers.map((register) => (
              <li key={register.id} className="hover:bg-green-50/50 transition-colors duration-150">
                <div className="px-6 py-5">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                          <span className="text-2xl">🍽️</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-gray-900">
                            {register.food_name}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {t('admin.registers.user')}: {register.user_email || 'N/A'} • {new Date(register.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                        <p className="text-2xl font-bold text-green-700">
                          {register.calories}
                        </p>
                        <p className="text-xs text-green-600 font-medium">
                          kcal
                        </p>
                      </div>
                      <div className="text-right bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                        <p className="text-xl font-bold text-gray-700">
                          {register.quantity}
                        </p>
                        <p className="text-xs text-gray-600 font-medium">
                          {t('admin.registers.grams')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pl-0 sm:pl-15">
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                        <span className="text-xs font-medium text-blue-700">{t('admin.registers.proteins')}</span>
                        <span className="text-sm font-bold text-blue-900">{register.proteins}g</span>
                      </div>
                      <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-200">
                        <span className="text-xs font-medium text-yellow-700">{t('admin.registers.carbohydrates')}</span>
                        <span className="text-sm font-bold text-yellow-900">{register.carbohydrates}g</span>
                      </div>
                      <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200">
                        <span className="text-xs font-medium text-orange-700">{t('admin.registers.fats')}</span>
                        <span className="text-sm font-bold text-orange-900">{register.fats}g</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteRegister(register.id)}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                      {t('admin.registers.delete')}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminRegistersList;
