import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Bot, User, Loader, Sparkles } from 'lucide-react';
import chatbotService from '../../services/chatbotService';

const ChatInterface = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: t('chatbot.welcomeMessage'),
        timestamp: new Date().toISOString()
      }
    ]);
  }, [t]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const result = await chatbotService.sendMessage(inputMessage, conversationId);
      
      if (result.success) {
        const botMessage = {
          role: 'assistant',
          content: result.data.response,
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, botMessage]);
        
        if (result.data.conversation_id) {
          setConversationId(result.data.conversation_id);
        }
      } else {
        const errorMessage = {
          role: 'assistant',
          content: t('chatbot.errorMessage'),
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        role: 'assistant',
        content: t('chatbot.connectionError'),
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const QuickActions = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => setInputMessage('Genera mis metas nutricionales')}
        className="px-3 py-2 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
        disabled={isLoading}
      >
        {t('chatbot.quickActions.generateGoals')}
      </button>
      <button
        onClick={() => setInputMessage('¿Cuánta agua debo beber?')}
        className="px-3 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm hover:bg-cyan-200 transition-colors"
        disabled={isLoading}
      >
        {t('chatbot.quickActions.calculateWater')}
      </button>
      <button
        onClick={() => setInputMessage('Dame consejos para una alimentación saludable')}
        className="px-3 py-2 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
        disabled={isLoading}
      >
        {t('chatbot.quickActions.healthyTips')}
      </button>
      <button
        onClick={() => setInputMessage('Genera un plan alimenticio semanal')}
        className="px-3 py-2 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
        disabled={isLoading}
      >
        {t('chatbot.quickActions.weeklyPlan')}
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg border">
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold">{t('chatbot.title')}</h2>
            <p className="text-sm opacity-90">{t('chatbot.subtitle')}</p>
          </div>
        </div>
        <Sparkles className="w-6 h-6 animate-pulse" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(100vh - 250px)' }}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 ${
              message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-purple-500 text-white'
              }`}
            >
              {message.role === 'user' ? (
                <User className="w-5 h-5" />
              ) : (
                <Bot className="w-5 h-5" />
              )}
            </div>

            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white ml-auto'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.content}
              </div>
              <div
                className={`text-xs mt-2 opacity-70 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                {new Date(message.timestamp).toLocaleTimeString(i18n.language === 'es' ? 'es-ES' : 'en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-gray-100 px-4 py-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Loader className="w-4 h-4 animate-spin text-purple-500" />
                <span className="text-sm text-gray-600">{t('chatbot.typing')}</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-gray-50">
        <QuickActions />

        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={t('chatbot.typePlaceholder')}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
