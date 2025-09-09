import { useEffect, useState } from 'react';
import { TrendingUp, Target, Activity, Award, Calendar } from 'lucide-react';
import registerService from '../../services/registerService';

const DailySummary = ({ refreshTrigger, dateFilter }) => {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, [refreshTrigger, dateFilter]);

  const loadSummary = async () => {
    setIsLoading(true);
    try {
      let result;
      
      if (dateFilter.period === 'today' || dateFilter.period === 'yesterday') {
        // Para día específico, usar daily-summary
        const periodDates = registerService.getPeriodDates(dateFilter.period);
        const targetDate = periodDates.date;
        result = await registerService.getDailySummary(targetDate);
      } else {
        // Para períodos más largos, usar period-summary
        const filters = {};
        
        if (dateFilter.period === 'custom') {
          filters.period = 'custom';
          filters.start_date = dateFilter.start_date;
          filters.end_date = dateFilter.end_date;
        } else {
          filters.period = dateFilter.period.replace('this_', '').replace('last_', '');
        }
        
        result = await registerService.getPeriodSummary(filters);
      }
      
      if (result.success) {
        setSummary(result.data);
      }
    } catch (error) {
      console.error('Error loading summary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilterLabel = () => {
    if (dateFilter.period === 'custom') {
      return `${dateFilter.start_date} - ${dateFilter.end_date}`;
    }
    
    const labels = {
      'today': 'Hoy',
      'yesterday': 'Ayer',
      'this_week': 'Esta semana',
      'last_week': 'Semana pasada',
      'this_month': 'Este mes',
      'last_month': 'Mes pasado'
    };
    
    return labels[dateFilter.period] || 'Período seleccionado';
  };

  const isPeriodSummary = () => {
    return !['today', 'yesterday'].includes(dateFilter.period);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const totals = isPeriodSummary() 
    ? summary?.period_totals || {} 
    : summary?.totals || {};
  
  const goalsProgress = summary?.goals_progress || null;
  const count = isPeriodSummary() 
    ? summary?.total_count || 0 
    : summary?.count || 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2" />
        Resumen - {getFilterLabel()}
      </h2>

      {count === 0 ? (
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No hay registros para {getFilterLabel().toLowerCase()}</p>
          <p className="text-sm text-gray-400">
            {dateFilter.period === 'today' 
              ? '¡Registra tu primera comida!' 
              : 'Prueba con otro período'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Estadísticas principales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(totals.calories || 0)}
              </div>
              <div className="text-sm text-blue-800">Calorías</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(totals.protein || 0)}g
              </div>
              <div className="text-sm text-green-800">Proteínas</div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {Math.round(totals.carbs || 0)}g
              </div>
              <div className="text-sm text-yellow-800">Carbohidratos</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(totals.fat || 0)}g
              </div>
              <div className="text-sm text-purple-800">Grasas</div>
            </div>
          </div>

          {/* Información adicional para períodos largos */}
          {isPeriodSummary() && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {summary?.days_in_period || 0}
                </div>
                <div className="text-sm text-gray-800">Días en período</div>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">
                  {summary?.days_with_records || 0}
                </div>
                <div className="text-sm text-indigo-800">Días con registros</div>
              </div>
              
              <div className="bg-teal-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-teal-600">
                  {Math.round((totals.calories || 0) / (summary?.days_with_records || 1))}
                </div>
                <div className="text-sm text-teal-800">Cal/día promedio</div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(((summary?.days_with_records || 0) / (summary?.days_in_period || 1)) * 100)}%
                </div>
                <div className="text-sm text-orange-800">Consistencia</div>
              </div>
            </div>
          )}

          {/* Progreso hacia objetivos (solo para hoy y ayer) */}
          {goalsProgress && !isPeriodSummary() && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Progreso hacia objetivos
              </h3>
              
              {Object.entries(goalsProgress).map(([key, progress]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{key}</span>
                    <span>{Math.round(progress.consumed)} / {progress.goal}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        progress.percentage >= 100 ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(progress.percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    {progress.percentage}%
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Información de registros */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Total de registros:</span>
              <span className="font-medium">{count}</span>
            </div>
            {isPeriodSummary() && summary?.daily_summary && (
              <div className="mt-2 text-xs text-gray-500">
                Distribución: {summary.daily_summary.length} días analizados
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DailySummary;