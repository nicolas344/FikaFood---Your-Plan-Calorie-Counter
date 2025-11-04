import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Camera, Zap, Activity, Award, ChevronDown, ChevronUp } from 'lucide-react';
import registerService from '../../services/registerService';

const RegistersList = ({ refreshTrigger, dateFilter = { period: 'today' } }) => {
  const { t, i18n } = useTranslation();
  const [registers, setRegisters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedFoodItems, setExpandedFoodItems] = useState(new Set());

  useEffect(() => {
    loadRegisters();
  }, [refreshTrigger, dateFilter]);

  const loadRegisters = async () => {
    setIsLoading(true);
    try {
      const filters = {};
      
      if (dateFilter.period === 'custom') {
        filters.start_date = dateFilter.start_date;
        filters.end_date = dateFilter.end_date;
      } else {
        const periodDates = registerService.getPeriodDates(dateFilter.period);
        Object.assign(filters, periodDates);
      }

      const result = await registerService.getRegisters(filters);
      if (result.success) {
        setRegisters(result.data.results || result.data || []);
      }
    } catch (error) {
      console.error('Error loading registers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFoodItems = (registerId) => {
    const newExpanded = new Set(expandedFoodItems);
    if (newExpanded.has(registerId)) {
      newExpanded.delete(registerId);
    } else {
      newExpanded.add(registerId);
    }
    setExpandedFoodItems(newExpanded);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const locale = i18n.language === 'es' ? 'es-ES' : 'en-US';
    return date.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'analyzing': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'completed': 'bg-green-100 text-green-800 border-green-200',
      'failed': 'bg-red-100 text-red-800 border-red-200',
      'reviewing': 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusText = (status) => {
    return t(`registers.status.${status}`) || status;
  };

  const getFilterLabel = () => {
    const currentFilter = dateFilter || { period: 'today' };
    if (currentFilter.period === 'custom') {
      return `${currentFilter.start_date} - ${currentFilter.end_date}`;
    }
    
    return t(`registers.periods.${currentFilter.period}`) || t('registers.periodLabels.selected');
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="border rounded-lg p-4">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-2">
                  <div className="w-full h-16 bg-gray-200 rounded"></div>
                </div>
                <div className="col-span-10 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-4 py-3 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <Camera className="w-5 h-5 mr-2 text-blue-600" />
            {t('registers.list.registersOf')} {getFilterLabel()}
          </h2>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {registers.length} {registers.length === 1 ? t('registers.list.register') : t('registers.list.registers')}
          </div>
        </div>
      </div>

      <div className="p-4">
        {registers.length === 0 ? (
          <div className="text-center py-8">
            <Camera className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-600 mb-1">
              {t('registers.list.noRegisters')} {getFilterLabel()}
            </h3>
            <p className="text-sm text-gray-500">
              {dateFilter.period === 'today' 
                ? t('registers.list.registerFirstMeal')
                : t('registers.list.tryAnotherPeriod')
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {registers.map((register) => {
              const isExpanded = expandedFoodItems.has(register.id);
              const foodItems = register.food_items || [];
              const visibleItems = isExpanded ? foodItems : foodItems.slice(0, 3);
              const hasMoreItems = foodItems.length > 3;

              return (
                <div key={register.id} className="border rounded-lg hover:shadow-md transition-shadow duration-200">
                  <div className="grid grid-cols-12 gap-4 p-4">
                    <div className="col-span-12 sm:col-span-2">
                      <div className="w-full h-16 rounded-lg overflow-hidden shadow-sm">
                        <img 
                          src={register.image} 
                          alt={t('registers.list.registeredFood')}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="col-span-12 sm:col-span-6">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(register.status)}`}>
                          {getStatusText(register.status)}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(register.created_at)}
                        </span>
                      </div>

                      {register.description && (
                        <div className="mb-3">
                          <p className="text-xs font-medium text-gray-600 mb-1">{t('registers.list.yourDescription')}</p>
                          <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded border-l-2 border-blue-400 leading-relaxed">
                            "{register.description}"
                          </p>
                        </div>
                      )}

                      {register.ai_description && register.status === 'completed' && (
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <Zap className="w-4 h-4 mr-1 text-purple-500" />
                            {t('registers.list.aiAnalysis')}
                          </p>
                          <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {register.ai_description}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="col-span-12 sm:col-span-4">
                      {register.status === 'completed' && (
                        <div className="space-y-3">
                          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-3 rounded-lg border border-orange-200">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-orange-600">
                                {Math.round(register.total_calories)}
                              </div>
                              <div className="text-sm font-medium text-orange-800">{t('registers.summary.calories')}</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div className="bg-green-50 p-3 rounded border border-green-200 text-center">
                              <div className="text-lg font-bold text-green-600">
                                {Math.round(register.total_protein)}g
                              </div>
                              <div className="text-xs text-green-700 font-medium">{t('registers.list.prot')}</div>
                            </div>
                            
                            <div className="bg-yellow-50 p-3 rounded border border-yellow-200 text-center">
                              <div className="text-lg font-bold text-yellow-600">
                                {Math.round(register.total_carbs)}g
                              </div>
                              <div className="text-xs text-yellow-700 font-medium">{t('registers.list.carbs')}</div>
                            </div>
                            
                            <div className="bg-purple-50 p-3 rounded border border-purple-200 text-center">
                              <div className="text-lg font-bold text-purple-600">
                                {Math.round(register.total_fat)}g
                              </div>
                              <div className="text-xs text-purple-700 font-medium">{t('registers.summary.fats')}</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {register.estimated_weight && (
                              <div className="bg-gray-50 p-3 rounded text-center border">
                                <div className="font-bold text-gray-700">{Math.round(register.estimated_weight)}g</div>
                                <div className="text-xs text-gray-500 font-medium">{t('registers.list.estimatedWeight')}</div>
                              </div>
                            )}
                            
                            {register.ai_confidence && (
                              <div className="bg-blue-50 p-3 rounded text-center border border-blue-200">
                                <div className="font-bold text-blue-700">{Math.round(register.ai_confidence * 100)}%</div>
                                <div className="text-xs text-blue-600 font-medium">{t('registers.list.confidence')}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {register.status === 'completed' && (
                    <div className="border-t bg-gray-50 p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                        <Activity className="w-4 h-4 mr-2" />
                        {t('registers.list.completeNutritionalInfo')}
                      </h4>
                      
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                        <div className="bg-white p-3 rounded-lg border text-center shadow-sm">
                          <div className="text-lg font-bold text-green-600">
                            {Math.round(register.total_fiber || 0)}g
                          </div>
                          <div className="text-sm text-gray-600 font-medium">{t('registers.list.fiber')}</div>
                        </div>
                        
                        <div className="bg-white p-3 rounded-lg border text-center shadow-sm">
                          <div className="text-lg font-bold text-blue-600">
                            {Math.round(register.total_sugar || 0)}g
                          </div>
                          <div className="text-sm text-gray-600 font-medium">{t('registers.list.sugars')}</div>
                        </div>
                        
                        <div className="bg-white p-3 rounded-lg border text-center shadow-sm">
                          <div className="text-lg font-bold text-red-600">
                            {Math.round(register.total_sodium || 0)}mg
                          </div>
                          <div className="text-sm text-gray-600 font-medium">{t('registers.list.sodium')}</div>
                        </div>

                        <div className="bg-white p-3 rounded-lg border text-center shadow-sm">
                          <div className="text-lg font-bold text-indigo-600">
                            {Math.round((register.total_calories / (register.estimated_weight || 100)) * 100) || 0}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">{t('registers.list.calPer100g')}</div>
                        </div>

                        <div className="bg-white p-3 rounded-lg border text-center shadow-sm">
                          <div className="text-lg font-bold text-teal-600">
                            {Math.round(((register.total_protein * 4 + register.total_carbs * 4 + register.total_fat * 9) / register.total_calories * 100)) || 0}%
                          </div>
                          <div className="text-sm text-gray-600 font-medium">{t('registers.list.accuracy')}</div>
                        </div>

                        <div className="bg-white p-3 rounded-lg border text-center shadow-sm">
                          <div className="text-lg font-bold text-orange-600">
                            {Math.round(register.total_protein + register.total_carbs + register.total_fat)}g
                          </div>
                          <div className="text-sm text-gray-600 font-medium">{t('registers.list.total')}</div>
                        </div>
                      </div>

                      {foodItems.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-sm font-semibold text-gray-700 flex items-center">
                              <Award className="w-4 h-4 mr-2" />
                              {t('registers.list.detectedFoods')} ({foodItems.length})
                            </h5>
                            {hasMoreItems && (
                              <button
                                onClick={() => toggleFoodItems(register.id)}
                                className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                              >
                                {isExpanded ? (
                                  <>
                                    <ChevronUp className="w-4 h-4 mr-1" />
                                    {t('registers.list.viewLess')}
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="w-4 h-4 mr-1" />
                                    {t('registers.list.viewAll')} ({foodItems.length})
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {visibleItems.map((item, index) => (
                              <div key={index} className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex-1">
                                    <h6 className="font-semibold text-gray-800 text-sm leading-tight">
                                      {item.name}
                                    </h6>
                                    <p className="text-sm text-gray-600 mt-1">{item.category}</p>
                                    <p className="text-sm text-blue-600 font-medium mt-1">
                                      {item.estimated_quantity}{item.quantity_unit}
                                    </p>
                                  </div>
                                  <div className="text-right ml-3">
                                    <div className="text-lg font-bold text-orange-600">
                                      {Math.round(item.calories)}
                                    </div>
                                    <div className="text-sm text-orange-800 font-medium">cal</div>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-3">
                                  <div className="text-center bg-green-50 p-2 rounded">
                                    <div className="text-lg font-bold text-green-600">{Math.round(item.protein)}g</div>
                                    <div className="text-sm text-green-700 font-medium">{t('registers.summary.proteins')}</div>
                                  </div>
                                  <div className="text-center bg-yellow-50 p-2 rounded">
                                    <div className="text-lg font-bold text-yellow-600">{Math.round(item.carbs)}g</div>
                                    <div className="text-sm text-yellow-700 font-medium">{t('registers.summary.carbohydrates')}</div>
                                  </div>
                                  <div className="text-center bg-purple-50 p-2 rounded">
                                    <div className="text-lg font-bold text-purple-600">{Math.round(item.fat)}g</div>
                                    <div className="text-sm text-purple-700 font-medium">{t('registers.summary.fats')}</div>
                                  </div>
                                </div>
                                
                                {item.confidence && (
                                  <div className="mt-3 text-center">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                      {t('registers.list.confidence')}: {Math.round(item.confidence * 100)}%
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          
                          {!isExpanded && hasMoreItems && (
                            <div className="mt-3 text-center">
                              <p className="text-sm text-gray-500">
                                {t('registers.list.andMore', { count: foodItems.length - 3 })}
                                <button 
                                  onClick={() => toggleFoodItems(register.id)}
                                  className="text-blue-600 hover:text-blue-800 font-medium ml-1"
                                >
                                  {t('registers.list.viewAll')}
                                </button>
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistersList;
