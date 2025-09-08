import { useEffect, useState } from 'react';
import { Clock, Camera, TrendingUp } from 'lucide-react';
import registerService from '../../services/registerService';

const RegistersList = ({ refreshTrigger }) => {
  const [registers, setRegisters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRegisters();
  }, [refreshTrigger]);

  const loadRegisters = async () => {
    setIsLoading(true);
    try {
      const result = await registerService.getRegisters();
      if (result.success) {
        setRegisters(result.data.results || result.data || []);
      }
    } catch (error) {
      console.error('Error loading registers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'analyzing': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800',
      'reviewing': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      'analyzing': 'Analizando',
      'completed': 'Completado',
      'failed': 'Error',
      'reviewing': 'Revisando'
    };
    return texts[status] || status;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <Camera className="w-5 h-5 mr-2" />
        Mis Registros ({registers.length})
      </h2>

      {registers.length === 0 ? (
        <div className="text-center py-8">
          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No tienes registros aún</p>
          <p className="text-sm text-gray-400">¡Registra tu primera comida!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {registers.map((register) => (
            <div key={register.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex space-x-4">
                {/* Imagen */}
                <div className="w-16 h-16 flex-shrink-0">
                  <img 
                    src={register.image} 
                    alt="Comida registrada"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Información */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Estado */}
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(register.status)}`}>
                          {getStatusText(register.status)}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(register.created_at)}
                        </span>
                      </div>

                      {/* Descripción */}
                      {register.description && (
                        <p className="text-sm text-gray-600 mb-2 truncate">
                          {register.description}
                        </p>
                      )}

                      {/* IA Description */}
                      {register.ai_description && register.status === 'completed' && (
                        <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                          {register.ai_description}
                        </p>
                      )}
                    </div>

                    {/* Información nutricional */}
                    {register.status === 'completed' && (
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {Math.round(register.total_calories)} cal
                        </div>
                        <div className="text-xs text-gray-500 space-y-1">
                          <div>P: {Math.round(register.total_protein)}g</div>
                          <div>C: {Math.round(register.total_carbs)}g</div>
                          <div>G: {Math.round(register.total_fat)}g</div>
                        </div>
                        {register.ai_confidence && (
                          <div className="text-xs text-gray-400 mt-1">
                            Confianza: {Math.round(register.ai_confidence * 100)}%
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RegistersList;