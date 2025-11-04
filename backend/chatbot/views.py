from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Conversation, Message
from .serializers import ConversationSerializer, ChatRequestSerializer
from .services import ChatbotService

class ConversationListView(generics.ListAPIView):
    """Lista las conversaciones del usuario"""
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat_message(request):
    """Envía un mensaje al chatbot"""
    serializer = ChatRequestSerializer(data=request.data)
    
    if serializer.is_valid():
        message = serializer.validated_data['message']
        conversation_id = serializer.validated_data.get('conversation_id')
        language = serializer.validated_data.get('language', 'es')
        
        conversation = None
        if conversation_id:
            try:
                conversation = Conversation.objects.get(
                    id=conversation_id, 
                    user=request.user
                )
            except Conversation.DoesNotExist:
                return Response(
                    {'error': 'Conversación no encontrada'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        
        # Usar el servicio del chatbot
        chatbot_service = ChatbotService()
        result = chatbot_service.generate_response(
            user_message=message,
            user=request.user,
            conversation=conversation,
            language=language
        )
        
        if result['success']:
            return Response({
                'response': result['response'],
                'conversation_id': result['conversation_id'],
                'success': True
            })
        else:
            return Response({
                'error': 'Error al procesar tu mensaje. Intenta de nuevo.',
                'success': False
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_conversation(request, conversation_id):
    """Obtiene una conversación específica"""
    conversation = get_object_or_404(
        Conversation, 
        id=conversation_id, 
        user=request.user
    )
    serializer = ConversationSerializer(conversation)
    return Response(serializer.data)
