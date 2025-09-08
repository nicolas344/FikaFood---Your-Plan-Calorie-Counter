import { useEffect, useState } from 'react';
import { TrendingUp, Target, Activity, Award } from 'lucide-react';
import registerService from '../../services/registerService';

const DailySummary = ({ refreshTrigger }) => {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, [refreshTrigger]);

  const loadSummary = async () => {
    setIsLoading(true);
    try {
      const result = await registerService.getDailySummary();
      if (result.success) {
        setSummary(result.data);
      }
    } catch (error) {
      console.error('Error loading summary:', error);
    } finally {
      setIsLoading(false);
    }
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

  const totals = summary?.totals || {};
  const goalsProgress = summary?.goals_progress || null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2" />
        Resumen de Hoy
      </h2>

      {summary?.count === 0 ? (
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No hay registros hoy</p>
          <p className="text-sm text-gray-400">¡Registra tu primera comida!</p>
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

          {/* Progreso hacia objetivos */}
          {goalsProgress && (
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

          {/* Información adicional */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Registros hoy:</span>
              <span className="font-medium">{summary.count}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailySummary;