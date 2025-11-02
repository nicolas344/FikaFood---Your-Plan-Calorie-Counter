import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

const AdminConversationsList = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllConversations();
      setConversations(response.data.results || response.data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta conversación?')) {
      try {
        await adminService.deleteConversation(conversationId);
        loadConversations();
      } catch (error) {
        console.error('Error deleting conversation:', error);
        alert('Error al eliminar la conversación');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-t-4 border-green-500 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
          </div>
          <p className="mt-4 text-gray-700 font-medium">Cargando conversaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
            Conversaciones del Chatbot
          </h2>
          <p className="text-sm text-gray-600 mt-1">Monitorea las interacciones con el asistente</p>
        </div>
        <button
          onClick={loadConversations}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar
        </button>
      </div>

      {conversations.length === 0 ? (
        <div className="text-center py-16 bg-white/90 backdrop-blur rounded-2xl border border-gray-200">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
          <p className="text-gray-500 text-lg font-medium">No hay conversaciones registradas</p>
          <p className="text-gray-400 text-sm mt-1">Las conversaciones del chatbot aparecerán aquí</p>
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur shadow-lg overflow-hidden rounded-2xl border border-gray-200">
          <ul className="divide-y divide-gray-200">
            {conversations.map((conversation) => (
              <li key={conversation.id} className="hover:bg-green-50/50 transition-colors duration-150">
                <div className="px-6 py-5">
                  {/* Header con ID y contador de mensajes */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-lime-400 to-green-500 rounded-xl flex items-center justify-center shadow-md">
                          <span className="text-2xl">💬</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-gray-900">
                            Conversación #{conversation.id}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Usuario: {conversation.user_email || 'N/A'} • {new Date(conversation.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="text-center bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                        <p className="text-2xl font-bold text-green-700">
                          {conversation.messages_count || 0}
                        </p>
                        <p className="text-xs text-green-600 font-medium">
                          mensajes
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Último mensaje y botón */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pl-0 sm:pl-15">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                        <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                        </svg>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 font-medium mb-1">Último mensaje:</p>
                          <p className="text-sm text-gray-700 truncate">
                            {conversation.last_message || 'Sin mensajes'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteConversation(conversation.id)}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex-shrink-0"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminConversationsList;
