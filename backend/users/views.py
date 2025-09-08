from django.shortcuts import render
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User
from .serializers import (
    UserRegistrationSerializer, 
    UserLoginSerializer, 
    UserProfileSerializer,
    UserUpdateSerializer,
    NutritionGoalsSerializer,
    WaterGoalSerializer
)

# Create your views here.

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Usuario registrado exitosamente',
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)

class UserLoginView(APIView):
    """Vista para login de usuarios"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'Login exitoso',
                'user': UserProfileSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(generics.RetrieveUpdateAPIView):
    """Vista para ver y actualizar perfil del usuario"""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = UserUpdateSerializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Perfil actualizado exitosamente',
                'user': UserProfileSerializer(instance).data
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLogoutView(APIView):
    """Vista para logout (blacklist del refresh token)"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logout exitoso'})
        except Exception:
            return Response({'error': 'Token inválido'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def set_manual_goals(request):
    """Guarda metas nutricionales manuales"""
    serializer = NutritionGoalsSerializer(data=request.data)
    
    if serializer.is_valid():
        user = request.user
        user.calories_goal = serializer.validated_data['calories']
        user.protein_goal = serializer.validated_data['protein']
        user.carbs_goal = serializer.validated_data['carbs']
        user.fat_goal = serializer.validated_data['fat']
        user.goals_method = 'manual'
        user.save()
        
        return Response({
            'message': 'Metas nutricionales guardadas',
            'goals': {
                'calories': user.calories_goal,
                'protein': user.protein_goal,
                'carbs': user.carbs_goal,
                'fat': user.fat_goal,
                'method': 'Manual'
            }
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def set_manual_water(request):
    """Guarda meta de agua manual - USANDO SERIALIZER"""
    serializer = WaterGoalSerializer(data=request.data)
    
    if serializer.is_valid():
        user = request.user
        user.water_goal = serializer.validated_data['water_ml']
        user.water_method = 'manual'
        user.save()
        
        return Response({
            'message': 'Meta de agua guardada',
            'water': {
                'water_ml': user.water_goal,
                'method': 'Manual'
            }
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def user_goals(request):
    """Ver o eliminar metas nutricionales"""
    user = request.user
    
    if request.method == 'GET':
        if user.has_nutrition_goals:
            return Response({
                'calories': user.calories_goal,
                'protein': user.protein_goal,
                'carbs': user.carbs_goal,
                'fat': user.fat_goal,
                'method': user.get_goals_method_display()
            })
        else:
            return Response({'message': 'No tienes metas nutricionales'})
    
    elif request.method == 'DELETE':
        user.calories_goal = None
        user.protein_goal = None
        user.carbs_goal = None
        user.fat_goal = None
        user.goals_method = None
        user.save()
        return Response({'message': 'Metas nutricionales eliminadas'})

@api_view(['GET', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def user_water(request):
    """Ver o eliminar meta de agua"""
    user = request.user
    
    if request.method == 'GET':
        if user.has_water_goal:
            return Response({
                'water_ml': user.water_goal,
                'method': user.get_water_method_display()
            })
        else:
            return Response({'message': 'No tienes meta de agua'})
    
    elif request.method == 'DELETE':
        user.water_goal = None
        user.water_method = None
        user.save()
        return Response({'message': 'Meta de agua eliminada'})

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_dashboard(request):
    """Dashboard básico del usuario"""
    user = request.user
    
    return Response({
        'user': UserProfileSerializer(user).data,
        'stats': {
            'has_nutrition_goals': user.has_nutrition_goals,
            'has_water_goal': user.has_water_goal,
        }
    })
