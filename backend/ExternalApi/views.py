import requests
from django.http import JsonResponse
from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from .serializers import UserListSerializer

def productos(request):
    response = requests.get("https://comercia-1.onrender.com/es/api/products/")
    data = response.json()
    return JsonResponse(data)

User = get_user_model()

class UserListView(generics.ListAPIView):

    queryset = User.objects.all()
    serializer_class = UserListSerializer
    permission_classes = [permissions.AllowAny]
    search_fields = ['username', 'email', 'first_name', 'last_name']
