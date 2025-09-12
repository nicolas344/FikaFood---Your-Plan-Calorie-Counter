import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

const AdminMealPlansList = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMealPlans();
  }, []);

  const loadMealPlans = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllMealPlans();
      setMealPlans(response.data.results || response.data);
    } catch (error) {
      console.error('Error loading meal plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMealPlan = async (mealPlanId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este plan de comida?')) {
      try {
        await adminService.deleteMealPlan(mealPlanId);
        loadMealPlans();
      } catch (error) {
        console.error('Error deleting meal plan:', error);
        alert('Error al eliminar el plan de comida');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-4">Cargando planes de comida...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Planes de Comida</h2>
        <button
          onClick={loadMealPlans}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Actualizar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mealPlans.map((plan) => (
          <div key={plan.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Plan #{plan.id}
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Usuario:</strong> {plan.user_email || 'N/A'}</p>
                <p><strong>Creado:</strong> {new Date(plan.created_at).toLocaleDateString()}</p>
                <p><strong>Calorías objetivo:</strong> {plan.target_calories}</p>
                <p><strong>Días:</strong> {plan.days}</p>
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleDeleteMealPlan(plan.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mealPlans.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay planes de comida registrados</p>
        </div>
      )}
    </div>
  );
};

export default AdminMealPlansList;
