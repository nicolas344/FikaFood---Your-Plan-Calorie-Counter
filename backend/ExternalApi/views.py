import requests
from django.http import JsonResponse
from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from .serializers import UserListSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from registers.models import FoodRegister
from registers.serializers import FoodRegisterSerializer

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

@api_view(['GET'])
@permission_classes([AllowAny])
def external_food_registers(request):
    registers = FoodRegister.objects.filter(status='completed').order_by('-created_at')
    serializer = FoodRegisterSerializer(registers, many=True, context={'request': request})
    return Response({
        'count': len(serializer.data),
        'results': serializer.data
    })