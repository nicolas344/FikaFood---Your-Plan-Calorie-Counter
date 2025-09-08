from django.contrib import admin
from .models import Conversation, Message
# Registrar los modelos para que sean gestionables desde el admin de Django
admin.site.register(Conversation)
admin.site.register(Message)