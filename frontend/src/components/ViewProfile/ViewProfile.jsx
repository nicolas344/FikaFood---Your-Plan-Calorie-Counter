import { useState } from 'react';
import { User, Mail, Calendar, Target, Activity, Droplets, ArrowLeft, Edit, Utensils } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Alert from '../common/Alert';

const ViewProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  // Función para formatear el nivel de actividad
  const formatActivityLevel = (level) => {
    const levels = {
      'sedentary': 'Sedentario (0-2 días)',
      'moderate': 'Moderado (3-5 días)', 
      'active': 'Activo (6+ días)'
    };
    return levels[level] || 'No especificado';
  };

  // Función para formatear el objetivo
  const formatObjective = (objective) => {
    const objectives = {
      'lose': 'Perder peso',
      'maintain': 'Mantener peso',
      'gain': 'Aumentar peso'
    };
    return objectives[objective] || 'No especificado';
  };

  // Función para formatear el sexo
  const formatGender = (gender) => {
    const genders = {
      'M': 'Masculino',
      'F': 'Femenino',
      'O': 'Otro'
    };
    return genders[gender] || 'No especificado';
  };

  // Función para formatear la preferencia dietética
  const formatDietaryPreference = (preference) => {
    const preferences = {
      'classic': 'Clásico',
      'vegetarian': 'Vegetariano',
      'vegan': 'Vegano',
      'pescetarian': 'Pescetariano'
    };
    return preferences[preference] || 'No especificado';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header compacto */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center">
              <Button
                onClick={() => navigate('/dashboard')}
                variant="outline"
                size="sm"
                className="mr-4 flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Volver
              </Button>

              <Button
                onClick={() => navigate('/profile-setup')}
                variant="primary"
                size="sm"
                className="flex items"
              >
                <Edit className="w-4 h-4 mr-1" />
                Editar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Grid de 3 columnas */}
      <main className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4">
            <Alert 
              type="error" 
              message={error} 
              onClose={() => setError(null)} 
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Información Personal */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-base font-medium text-gray-900 flex items-center">
                <User className="w-4 h-4 mr-2 text-blue-600" />
                Información Personal
              </h2>
            </div>
            <div className="px-4 py-3 space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500">Nombre completo</label>
                <p className="text-sm text-gray-900 mt-1">
                  {user?.first_name && user?.last_name 
                    ? `${user.first_name} ${user.last_name}` 
                    : 'No especificado'}
                </p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500">Email</label>
                <p className="text-sm text-gray-900 mt-1 flex items-center">
                  <Mail className="w-3 h-3 mr-1 text-gray-400" />
                  {user?.email || 'No especificado'}
                </p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500">Fecha de nacimiento</label>
                <p className="text-sm text-gray-900 mt-1 flex items-center">
                  <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                  {user?.date_of_birth || 'No especificado'}
                </p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500">Sexo</label>
                <p className="text-sm text-gray-900 mt-1">
                  {formatGender(user?.gender)}
                </p>
              </div>
            </div>
          </div>

          {/* Información Física */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-base font-medium text-gray-900 flex items-center">
                <Activity className="w-4 h-4 mr-2 text-green-600" />
                Información Física
              </h2>
            </div>
            <div className="px-4 py-3 space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500">Peso</label>
                <p className="text-sm text-gray-900 mt-1">
                  {user?.weight ? `${user.weight} kg` : 'No especificado'}
                </p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500">Altura</label>
                <p className="text-sm text-gray-900 mt-1">
                  {user?.height ? `${user.height} cm` : 'No especificado'}
                </p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500">Nivel de actividad</label>
                <p className="text-sm text-gray-900 mt-1">
                  {formatActivityLevel(user?.activity_level)}
                </p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500">Objetivo</label>
                <p className="text-sm text-gray-900 mt-1">
                  {formatObjective(user?.objective)}
                </p>
              </div>
            </div>
          </div>

          {/* Preferencias Dietéticas */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-base font-medium text-gray-900 flex items-center">
                <Utensils className="w-4 h-4 mr-2 text-orange-600" />
                Preferencias Dietéticas
              </h2>
            </div>
            <div className="px-4 py-3 space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500">Tipo de dieta</label>
                <p className="text-sm text-gray-900 mt-1 font-semibold">
                  {formatDietaryPreference(user?.dietary_preference)}
                </p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500">Restricciones adicionales</label>
                <p className="text-sm text-gray-900 mt-1">
                  {user?.additional_restrictions || 'Ninguna'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Segunda fila - Objetivos Nutricionales e Hidratación */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          {/* Objetivos Nutricionales */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-base font-medium text-gray-900 flex items-center">
                <Target className="w-4 h-4 mr-2 text-purple-600" />
                Objetivos Nutricionales
              </h2>
            </div>
            <div className="px-4 py-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Calorías diarias</label>
                  <p className="text-sm text-gray-900 mt-1 font-semibold">
                    {user?.calories_goal ? `${user.calories_goal} kcal` : 'No especificado'}
                  </p>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-500">Proteínas</label>
                  <p className="text-sm text-gray-900 mt-1 font-semibold">
                    {user?.protein_goal ? `${user.protein_goal}g` : 'No especificado'}
                  </p>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-500">Carbohidratos</label>
                  <p className="text-sm text-gray-900 mt-1 font-semibold">
                    {user?.carbs_goal ? `${user.carbs_goal}g` : 'No especificado'}
                  </p>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-500">Grasas</label>
                  <p className="text-sm text-gray-900 mt-1 font-semibold">
                    {user?.fat_goal ? `${user.fat_goal}g` : 'No especificado'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hidratación */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-base font-medium text-gray-900 flex items-center">
                <Droplets className="w-4 h-4 mr-2 text-blue-600" />
                Hidratación
              </h2>
            </div>
            <div className="px-4 py-3">
              <div>
                <label className="text-xs font-medium text-gray-500">Meta de agua diaria</label>
                <p className="text-lg text-gray-900 mt-2 font-bold text-center">
                  {user?.water_goal ? `${user.water_goal} ml` : 'No especificado'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewProfile;