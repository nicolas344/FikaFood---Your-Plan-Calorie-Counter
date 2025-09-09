from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from django.db.models import Count, Q
from django.utils import timezone
from datetime import datetime, timedelta
from registers.models import FoodRegister
from MealPlan.models import MealPlan
try:
    from chatbot.models import Conversation
    CONVERSATION_AVAILABLE = True
except ImportError:
    CONVERSATION_AVAILABLE = False
from .serializers import (
    AdminUserListSerializer, AdminRegisterListSerializer, DashboardStatsSerializer
)

User = get_user_model()

def is_admin_user(user):
    return user.is_authenticated and user.is_superuser

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    if not is_admin_user(request.user):
        return Response({'error': 'No tienes permisos de administrador'}, 
                       status=status.HTTP_403_FORBIDDEN)
    
    # Fechas para cálculos
    today = timezone.now().date()
    first_day_of_month = today.replace(day=1)
    last_month = (first_day_of_month - timedelta(days=1)).replace(day=1)
    week_ago = today - timedelta(days=7)
    
    # Estadísticas generales
    total_users = User.objects.count()
    total_meal_plans = MealPlan.objects.count()
    registers_today = FoodRegister.objects.filter(created_at__date=today).count()
    total_conversations = Conversation.objects.count() if CONVERSATION_AVAILABLE else 0
    
    # Estadísticas del mes pasado para comparar
    users_last_month = User.objects.filter(date_joined__lt=first_day_of_month).count()
    meal_plans_last_month = MealPlan.objects.filter(created_at__lt=first_day_of_month).count()
    registers_last_month = FoodRegister.objects.filter(created_at__date__lt=first_day_of_month).count()
    
    # Calcular cambios porcentuales
    users_change = calculate_percentage_change(total_users, users_last_month)
    meal_plans_change = calculate_percentage_change(total_meal_plans, meal_plans_last_month)
    registers_change = calculate_percentage_change(registers_today, registers_last_month)
    
    # Usuarios recientes
    recent_users = User.objects.filter(
        last_login__isnull=False
    ).order_by('-last_login')[:5]
    
    # Estadísticas adicionales
    new_users_week = User.objects.filter(date_joined__gte=week_ago).count()
    meal_plans_today = MealPlan.objects.filter(created_at__date=today).count()
    
    stats = {
        'total_users': total_users,
        'total_meal_plans': total_meal_plans,
        'registers_today': registers_today,
        'total_conversations': total_conversations,
        'users_change': users_change,
        'meal_plans_change': meal_plans_change,
        'registers_change': registers_change,
        'conversations_change': 0,  # Por ahora
        'recent_users': [
            {
                'email': user.email,
                'last_login': user.last_login.strftime('%d/%m %H:%M') if user.last_login else 'Nunca'
            } for user in recent_users
        ],
        'new_users_week': new_users_week,
        'meal_plans_today': meal_plans_today,
    }
    
    return Response(stats)

def calculate_percentage_change(current, previous):
    if previous == 0:
        return 100 if current > 0 else 0
    return round(((current - previous) / previous) * 100, 1)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def users_list(request):
    if not is_admin_user(request.user):
        return Response({'error': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
    
    queryset = User.objects.all().order_by('-date_joined')
    
    # Filtros
    search = request.query_params.get('search', None)
    if search:
        queryset = queryset.filter(
            Q(username__icontains=search) |
            Q(email__icontains=search) |
            Q(first_name__icontains=search) |
            Q(last_name__icontains=search)
        )
    
    # Paginación simple
    page = int(request.query_params.get('page', 1))
    page_size = int(request.query_params.get('page_size', 20))
    start = (page - 1) * page_size
    end = start + page_size
    
    users = queryset[start:end]
    total = queryset.count()
    
    serializer = AdminUserListSerializer(users, many=True)
    
    return Response({
        'results': serializer.data,
        'count': total,
        'page': page,
        'page_size': page_size,
        'total_pages': (total + page_size - 1) // page_size
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def meal_plans_list(request):
    if not is_admin_user(request.user):
        return Response({'error': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
    
    queryset = MealPlan.objects.all().order_by('-created_at')
    
    # Paginación
    page = int(request.query_params.get('page', 1))
    page_size = int(request.query_params.get('page_size', 20))
    start = (page - 1) * page_size
    end = start + page_size
    
    meal_plans = queryset[start:end]
    total = queryset.count()
    
    # Serializar manualmente
    results = []
    for plan in meal_plans:
        results.append({
            'id': plan.id,
            'user_email': plan.user.email if plan.user else 'N/A',
            'created_at': plan.created_at,
            'start_date': plan.start_date,
            'end_date': plan.end_date,
            'days': (plan.end_date - plan.start_date).days + 1,
        })
    
    return Response({
        'results': results,
        'count': total,
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def registers_list(request):
    if not is_admin_user(request.user):
        return Response({'error': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
    
    queryset = FoodRegister.objects.all().order_by('-created_at')
    
    # Filtros
    user_id = request.query_params.get('user_id', None)
    if user_id:
        queryset = queryset.filter(user_id=user_id)
    
    search = request.query_params.get('search', None)
    if search:
        queryset = queryset.filter(description__icontains=search)
    
    # Paginación
    page = int(request.query_params.get('page', 1))
    page_size = int(request.query_params.get('page_size', 20))
    start = (page - 1) * page_size
    end = start + page_size
    
    registers = queryset[start:end]
    total = queryset.count()
    
    serializer = AdminRegisterListSerializer(registers, many=True)
    
    return Response({
        'results': serializer.data,
        'count': total,
        'page': page,
        'page_size': page_size,
        'total_pages': (total + page_size - 1) // page_size
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def conversations_list(request):
    if not is_admin_user(request.user):
        return Response({'error': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
    
    if not CONVERSATION_AVAILABLE:
        return Response({
            'results': [],
            'count': 0,
        })
    
    try:
        queryset = Conversation.objects.all().order_by('-created_at')
        
        # Paginación
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 20))
        start = (page - 1) * page_size
        end = start + page_size
        
        conversations = queryset[start:end]
        total = queryset.count()
        
        # Serializar manualmente
        results = []
        for conv in conversations:
            results.append({
                'id': conv.id,
                'user_email': conv.user.email if conv.user else 'N/A',
                'created_at': conv.created_at,
                'messages_count': conv.messages.count() if hasattr(conv, 'messages') else 0,
                'last_message': 'Ver conversación',  # Placeholder
            })
        
        return Response({
            'results': results,
            'count': total,
        })
    except Exception as e:
        return Response({
            'results': [],
            'count': 0,
            'error': str(e)
        })

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, user_id):
    if not is_admin_user(request.user):
        return Response({'error': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        user = User.objects.get(id=user_id)
        if user.is_superuser:
            return Response({'error': 'No se puede eliminar un superusuario'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        user.delete()
        return Response({'success': True, 'message': 'Usuario eliminado correctamente'})
    except User.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_meal_plan(request, plan_id):
    if not is_admin_user(request.user):
        return Response({'error': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        plan = MealPlan.objects.get(id=plan_id)
        plan.delete()
        return Response({'success': True, 'message': 'Plan eliminado correctamente'})
    except MealPlan.DoesNotExist:
        return Response({'error': 'Plan no encontrado'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_register(request, register_id):
    if not is_admin_user(request.user):
        return Response({'error': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        register = FoodRegister.objects.get(id=register_id)
        register.delete()
        return Response({'success': True, 'message': 'Registro eliminado correctamente'})
    except FoodRegister.DoesNotExist:
        return Response({'error': 'Registro no encontrado'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_conversation(request, conversation_id):
    if not is_admin_user(request.user):
        return Response({'error': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
    
    if not CONVERSATION_AVAILABLE:
        return Response({'error': 'Conversaciones no disponibles'}, status=status.HTTP_404_NOT_FOUND)
    
    try:
        conversation = Conversation.objects.get(id=conversation_id)
        conversation.delete()
        return Response({'success': True, 'message': 'Conversación eliminada correctamente'})
    except Exception as e:
        return Response({'error': 'Conversación no encontrada'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_user_active(request, user_id):
    if not is_admin_user(request.user):
        return Response({'error': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        user = User.objects.get(id=user_id)
        user.is_active = not user.is_active
        user.save()
        
        return Response({
            'success': True,
            'is_active': user.is_active,
            'message': f"Usuario {'activado' if user.is_active else 'desactivado'} correctamente"
        })
    except User.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
