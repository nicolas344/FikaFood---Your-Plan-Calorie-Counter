import api from './api';

const mealPlanService = {
   async deleteMealPlan(id) {
    try {
      const response = await fetch(`/api/mealplans/${id}/`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar el plan");
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

    // Generar un nuevo plan (usando la IA + guardado en backend)
  generate: async () => {
    try {
      const response = await api.post('/mealplan/generate/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error generating meal plan:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al generar plan'
      };
    }
  },

  // Listar planes del usuario
  getMealPlans: async () => {
    try {
      const response = await api.get('/mealplan/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching meal plans:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al cargar planes'
      };
    }
  },

  // Obtener un plan específico
  getMealPlan: async (planId) => {
    try {
      const response = await api.get(`/mealplan/${planId}/`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching meal plan:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al cargar plan'
      };
    }
  }

};

export default mealPlanService;
