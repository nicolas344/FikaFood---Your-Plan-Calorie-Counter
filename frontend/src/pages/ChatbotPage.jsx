import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/common/ProtectedRoute';
import ChatInterface from '../components/chatbot/ChatInterface';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatbotPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-4 p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center">
                <MessageCircle className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Asistente Nutricional
                  </h1>
                  <p className="text-gray-600">
                    Hola {user?.first_name || 'Usuario'}, ¿en qué te puedo ayudar hoy?
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="max-w-4xl mx-auto">
            <div style={{ height: 'calc(100vh - 150px)' }}>
              <ChatInterface />
            </div>
          </div>

          {/* Tips Card */}
          <div className="max-w-4xl mx-auto mt-6">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                💡 Consejos para usar el asistente:
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Sé específico en tus preguntas para obtener mejores respuestas</li>
                <li>• Usa las acciones rápidas para solicitudes comunes</li>
                <li>• El asistente puede guardar automáticamente tus metas generadas</li>
                <li>• Puedes preguntar sobre alimentos, recetas y consejos nutricionales</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ChatbotPage;
