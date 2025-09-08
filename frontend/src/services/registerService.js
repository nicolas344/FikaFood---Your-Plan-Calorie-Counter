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
   * Obtener lista de registros
   */
  async getRegisters() {
    try {
      const response = await api.get('/registers/');
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
   * Obtener resumen diario
   */
  async getDailySummary() {
    try {
      const response = await api.get('/registers/daily-summary/');
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
}

export default new RegisterService();