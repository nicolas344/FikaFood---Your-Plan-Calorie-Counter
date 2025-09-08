from rest_framework import serializers
from .models import Conversation, Message

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'role', 'content', 'timestamp']

class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    message_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Conversation
        fields = ['id', 'created_at', 'messages', 'message_count']  # Quitar title y updated_at
    
    def get_message_count(self, obj):
        return obj.messages.count()

class ChatRequestSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=1000)
    conversation_id = serializers.IntegerField(required=False, allow_null=True)