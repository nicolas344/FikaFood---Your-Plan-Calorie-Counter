import api from './api';

export const adminService = {
  // Dashboard stats
  getDashboardStats: () => api.get('/admin/dashboard-stats/'),
  
  // User management
  getAllUsers: (params = {}) => api.get('/admin/users/', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}/`),
  updateUser: (id, data) => api.put(`/admin/users/${id}/`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}/`),
  
  // Meal plans management
  getAllMealPlans: (params = {}) => api.get('/admin/meal-plans/', { params }),
  getMealPlanById: (id) => api.get(`/admin/meal-plans/${id}/`),
  updateMealPlan: (id, data) => api.put(`/admin/meal-plans/${id}/`, data),
  deleteMealPlan: (id) => api.delete(`/admin/meal-plans/${id}/`),
  
  // Registers management
  getAllRegisters: (params = {}) => api.get('/admin/registers/', { params }),
  getRegisterById: (id) => api.get(`/admin/registers/${id}/`),
  deleteRegister: (id) => api.delete(`/admin/registers/${id}/`),
  
  // Chatbot conversations
  getAllConversations: (params = {}) => api.get('/admin/conversations/', { params }),
  getConversationById: (id) => api.get(`/admin/conversations/${id}/`),
  deleteConversation: (id) => api.delete(`/admin/conversations/${id}/`),
};
