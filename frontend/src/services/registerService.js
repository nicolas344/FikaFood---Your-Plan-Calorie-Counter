import api from './api';

class RegisterService {
  /**
   * Crear un nuevo registro de comida
   */
  async createRegister(formData) {
    try {
      const response = await api.post('/registers/create/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { message: 'Error de conexión' }
      };
    }
  }

  /**
   * Obtener lista de registros con filtros
   */
  async getRegisters(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      // Agregar filtros a los parámetros
      if (filters.date) {
        params.append('date', filters.date);
      }
      if (filters.start_date) {
        params.append('start_date', filters.start_date);
      }
      if (filters.end_date) {
        params.append('end_date', filters.end_date);
      }
      if (filters.period) {
        params.append('period', filters.period);
      }

      const url = `/registers/${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get(url);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { message: 'Error de conexión' }
      };
    }
  }

  /**
   * Obtener resumen diario o de fecha específica
   */
  async getDailySummary(date = null) {
    try {
      const url = date 
        ? `/registers/daily-summary/?date=${date}`
        : '/registers/daily-summary/';
      
      const response = await api.get(url);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { message: 'Error de conexión' }
      };
    }
  }

  /**
   * Obtener resumen por período
   */
  async getPeriodSummary(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.period) {
        params.append('period', filters.period);
      }
      if (filters.start_date) {
        params.append('start_date', filters.start_date);
      }
      if (filters.end_date) {
        params.append('end_date', filters.end_date);
      }

      const url = `/registers/period-summary/?${params.toString()}`;
      const response = await api.get(url);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { message: 'Error de conexión' }
      };
    }
  }

  /**
   * Obtener detalles de un registro
   */
  async getRegister(id) {
    try {
      const response = await api.get(`/registers/${id}/`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { message: 'Error de conexión' }
      };
    }
  }

  /**
   * Utility para formatear fechas
   */
  formatDate(date) {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    return date;
  }

  /**
   * Utility para obtener fechas de períodos predefinidos
   */
  getPeriodDates(period) {
    const today = new Date();
    const formatDate = (date) => date.toISOString().split('T')[0];

    switch (period) {
      case 'today':
        return { date: formatDate(today) };
      
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return { date: formatDate(yesterday) };
      
      case 'this_week':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        return { 
          start_date: formatDate(startOfWeek),
          end_date: formatDate(today)
        };
      
      case 'last_week':
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - today.getDay() - 7);
        const lastWeekEnd = new Date(lastWeekStart);
        lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
        return {
          start_date: formatDate(lastWeekStart),
          end_date: formatDate(lastWeekEnd)
        };
      
      case 'this_month':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return {
          start_date: formatDate(startOfMonth),
          end_date: formatDate(today)
        };
      
      case 'last_month':
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        return {
          start_date: formatDate(lastMonthStart),
          end_date: formatDate(lastMonthEnd)
        };
      
      default:
        return { date: formatDate(today) };
    }
  }
}

export default new RegisterService();