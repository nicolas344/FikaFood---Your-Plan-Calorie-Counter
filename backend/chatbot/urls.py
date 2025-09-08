from django.urls import path
from . import views

urlpatterns = [
    path('conversations/', views.ConversationListView.as_view(), name='conversation-list'),
    path('conversations/<int:conversation_id>/', views.get_conversation, name='conversation-detail'),
    path('chat/', views.chat_message, name='chat-message'),
]