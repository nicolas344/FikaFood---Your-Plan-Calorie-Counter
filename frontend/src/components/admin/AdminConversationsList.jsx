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
    return <div className="text-center py-4">Cargando conversaciones...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Conversaciones del Chatbot</h2>
        <button
          onClick={loadConversations}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Actualizar
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {conversations.map((conversation) => (
            <li key={conversation.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Conversación #{conversation.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        Usuario: {conversation.user_email || 'N/A'} | Fecha: {new Date(conversation.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {conversation.messages_count || 0} mensajes
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 truncate">
                      Último mensaje: {conversation.last_message || 'Sin mensajes'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDeleteConversation(conversation.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {conversations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay conversaciones registradas</p>
        </div>
      )}
    </div>
  );
};

export default AdminConversationsList;
