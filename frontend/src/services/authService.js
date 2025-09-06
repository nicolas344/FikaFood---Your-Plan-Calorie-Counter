import api from './api';

class AuthService {
  /**
   * Registrar nuevo usuario
   */
  async register(userData) {
    try {
      const response = await api.post('/auth/register/', userData);
      
      if (response.data.tokens) {
        this.setTokens(response.data.tokens);
      }
      
      return {
        success: true,
        data: response.data,
        user: response.data.user
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { message: 'Error de conexión' }
      };
    }
  }

  /**
   * Iniciar sesión
   */
  async login(credentials) {
    try {
      const response = await api.post('/auth/login/', credentials);
      
      if (response.data.tokens) {
        this.setTokens(response.data.tokens);
      }
      
      return {
        success: true,
        data: response.data,
        user: response.data.user
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { message: 'Error de conexión' }
      };
    }
  }

  /**
   * Cerrar sesión
   */
  async logout() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      this.clearTokens();
    }
  }

  /**
   * Obtener perfil del usuario actual
   */
  async getProfile() {
    try {
      const response = await api.get('/auth/profile/');
      return {
        success: true,
        user: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { message: 'Error de conexión' }
      };
    }
  }

  /**
   * Actualizar perfil del usuario
   */
  async updateProfile(profileData) {
    try {
      const response = await api.patch('/auth/profile/', profileData);
      return {
        success: true,
        user: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { message: 'Error de conexión' }
      };
    }
  }

  /**
   * Obtener dashboard del usuario
   */
  async getDashboard() {
    try {
      const response = await api.get('/auth/dashboard/');
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
   * Guardar tokens en localStorage
   */
  setTokens(tokens) {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
  }

  /**
   * Limpiar tokens del localStorage
   */
  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }

  /**
   * Obtener token de acceso
   */
  getAccessToken() {
    return localStorage.getItem('access_token');
  }
}

export default new AuthService();
