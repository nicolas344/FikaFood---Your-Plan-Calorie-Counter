import api from './api';
import i18n from '../locales/i18n';

const chatbotService = {
  // Enviar mensaje al chatbot
  sendMessage: async (message, conversationId = null) => {
    try {
      const payload = { 
        message,
        language: i18n.language || 'es'
      };
      if (conversationId) {
        payload.conversation_id = conversationId;
      }

      const response = await api.post('/chatbot/chat/', payload);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al enviar mensaje'
      };
    }
  },

  // Obtener conversaciones del usuario
  getConversations: async () => {
    try {
      const response = await api.get('/chatbot/conversations/');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al cargar conversaciones'
      };
    }
  },

  // Obtener una conversación específica
  getConversation: async (conversationId) => {
    try {
      const response = await api.get(`/chatbot/conversations/${conversationId}/`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Error al cargar conversación'
      };
    }
  }
};

export default chatbotService;
