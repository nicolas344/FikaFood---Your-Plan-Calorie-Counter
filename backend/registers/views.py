from django.shortcuts import render
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Sum, Count
from datetime import datetime, date, timedelta
from django.utils.dateparse import parse_date
from .models import FoodRegister, FoodItem
from .serializers import (
    FoodRegisterCreateSerializer,
    FoodRegisterSerializer,
    FoodRegisterUpdateSerializer
)
from .service import GeminiAnalyzer


class FoodRegisterCreateView(generics.CreateAPIView):
    """Crear registro con análisis de Gemini"""
    serializer_class = FoodRegisterCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            # Crear registro inicial
            food_register = FoodRegister.objects.create(
                user=request.user,
                image=serializer.validated_data['image'],
                description=serializer.validated_data.get('description', ''),
                status='analyzing',
                # Valores temporales
                ai_description='Analizando...',
                ai_confidence=0,
                total_calories=0,
                total_protein=0,
                total_carbs=0,
                total_fat=0,
                estimated_weight=0
            )
            
            # Analizar con Gemini
            analyzer = GeminiAnalyzer()
            gemini_data = analyzer.analyze_food_image(
                food_register.image, 
                food_register.description
            )
            print(gemini_data)
            # Actualizar registro con datos de Gemini
            food_register.ai_description = gemini_data['ai_description']
            food_register.ai_confidence = gemini_data['ai_confidence']
            food_register.total_calories = gemini_data['total_calories']
            food_register.total_protein = gemini_data['total_protein']
            food_register.total_carbs = gemini_data['total_carbs']
            food_register.total_fat = gemini_data['total_fat']
            food_register.total_fiber = gemini_data['total_fiber']
            food_register.total_sugar = gemini_data['total_sugar']
            food_register.total_sodium = gemini_data['total_sodium']
            food_register.estimated_weight = gemini_data['estimated_weight']
            food_register.status = 'completed'
            food_register.save()
            
            # Crear items individuales
            for item_data in gemini_data['food_items']:
                FoodItem.objects.create(
                    food_register=food_register,
                    name=item_data['name'],
                    category=item_data['category'],
                    estimated_quantity=item_data['estimated_quantity'],
                    quantity_unit=item_data['quantity_unit'],
                    calories=item_data['calories'],
                    protein=item_data['protein'],
                    carbs=item_data['carbs'],
                    fat=item_data['fat'],
                    fiber=item_data['fiber'],
                    sugar=item_data['sugar'],
                    sodium=item_data['sodium'],
                    confidence=item_data['confidence']
                )
            
            return Response({
                'message': 'Imagen analizada exitosamente',
                'register': FoodRegisterSerializer(food_register, context={'request': request}).data
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            # Marcar como fallido si algo sale mal
            if 'food_register' in locals():
                food_register.status = 'failed'
                food_register.ai_description = f'Error: {str(e)}'
                food_register.save()
            
            return Response({
                'error': 'Error al analizar imagen',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class FoodRegisterListView(generics.ListAPIView):
    """Listar registros del usuario con filtros de fecha"""
    serializer_class = FoodRegisterSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = FoodRegister.objects.filter(user=self.request.user).order_by('-created_at')
        
        # Filtro por fecha específica
        date_filter = self.request.query_params.get('date', None)
        if date_filter:
            try:
                filter_date = parse_date(date_filter)
                queryset = queryset.filter(created_at__date=filter_date)
            except ValueError:
                pass
        
        # Filtro por rango de fechas
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        
        if start_date:
            try:
                start = parse_date(start_date)
                queryset = queryset.filter(created_at__date__gte=start)
            except ValueError:
                pass
                
        if end_date:
            try:
                end = parse_date(end_date)
                queryset = queryset.filter(created_at__date__lte=end)
            except ValueError:
                pass
        
        # Filtro por período predefinido
        period = self.request.query_params.get('period', None)
        if period:
            today = date.today()
            
            if period == 'today':
                queryset = queryset.filter(created_at__date=today)
            elif period == 'yesterday':
                yesterday = today - timedelta(days=1)
                queryset = queryset.filter(created_at__date=yesterday)
            elif period == 'this_week':
                start_week = today - timedelta(days=today.weekday())
                queryset = queryset.filter(created_at__date__gte=start_week)
            elif period == 'last_week':
                start_last_week = today - timedelta(days=today.weekday() + 7)
                end_last_week = today - timedelta(days=today.weekday() + 1)
                queryset = queryset.filter(
                    created_at__date__gte=start_last_week,
                    created_at__date__lte=end_last_week
                )
            elif period == 'this_month':
                start_month = today.replace(day=1)
                queryset = queryset.filter(created_at__date__gte=start_month)
            elif period == 'last_month':
                # Primer día del mes pasado
                if today.month == 1:
                    start_last_month = today.replace(year=today.year-1, month=12, day=1)
                else:
                    start_last_month = today.replace(month=today.month-1, day=1)
                
                # Último día del mes pasado
                end_last_month = today.replace(day=1) - timedelta(days=1)
                
                queryset = queryset.filter(
                    created_at__date__gte=start_last_month,
                    created_at__date__lte=end_last_month
                )
        
        return queryset

class FoodRegisterDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Ver, actualizar o eliminar registro"""
    serializer_class = FoodRegisterSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = FoodRegister.objects.filter(user=self.request.user).order_by('-created_at')
        #filtro por fecha especifica
        date_filter= self.request.query_params.get('date', None)
        if date_filter:
            try:
                filter_date = parse_date(date_filter)
                queryset = queryset.filter(created_at__date=filter_date)
            except ValueError:
                pass
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)

        #filtro por fecha de inicio y fin
        if start_date:
            try:
                start = parse_date(start_date)
                queryset = queryset.filter(created_at__date__gte=start)
            except ValueError:
                pass
        if end_date:
            try:
                end = parse_date(end_date)
                queryset = queryset.filter(created_at__date__lte=end)
            except ValueError:
                pass

        #filtro por periodo definido
        period = self.request.query_params.get('period', None)

        if period:
            today = date.today()
            if period == 'today':
                queryset = queryset.filter(created_at__date=today)
            elif period == 'yesterday':
                yesterday = today - timedelta(days=1)
                queryset = queryset.filter(created_at__date=yesterday)
            elif period == 'this_week':
                start_week = today - timedelta(days=today.weekday())
                queryset = queryset.filter(created_at__date__gte=start_week)
            elif period == 'last_week':
                start_last_week = today - timedelta(days=today.weekday() + 7)
                end_last_week = today - timedelta(days=today.weekday() + 1)
                queryset = queryset.filter(
                    created_at__date__gte=start_last_week,
                    created_at__date__lte=end_last_week
                )
            elif period == 'this_month':
                start_month = today.replace(day=1)
                queryset = queryset.filter(created_at__date__gte=start_month)
            elif period == 'last_month':
                # Primer día del mes pasado
                if today.month == 1:
                    start_last_month = today.replace(year=today.year-1, month=12, day=1)
                else:
                    start_last_month = today.replace(month=today.month-1, day=1)
                
                # Último día del mes pasado
                end_last_month = today.replace(day=1) - timedelta(days=1)
                
                queryset = queryset.filter(
                    created_at__date__gte=start_last_month,
                    created_at__date__lte=end_last_month
                )
        
        return queryset

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def daily_summary(request):
    """Resumen nutricional del día o período específico"""
    # Obtener parámetros de fecha
    date_param = request.GET.get('date', None)
    
    if date_param:
        try:
            target_date = parse_date(date_param)
        except ValueError:
            target_date = date.today()
    else:
        target_date = date.today()
    
    # Obtener registros del día específico
    registers = FoodRegister.objects.filter(
        user=request.user,
        created_at__date=target_date,
        status='completed'
    )
    
    if not registers.exists():
        return Response({
            'date': target_date,
            'message': f'No hay registros para el {target_date}',
            'totals': {
                'calories': 0, 'protein': 0, 'carbs': 0, 'fat': 0,
                'fiber': 0, 'sugar': 0, 'sodium': 0
            },
            'count': 0
        })
    
    # Calcular totales
    totals = registers.aggregate(
        calories=Sum('total_calories'),
        protein=Sum('total_protein'),
        carbs=Sum('total_carbs'),
        fat=Sum('total_fat'),
        fiber=Sum('total_fiber'),
        sugar=Sum('total_sugar'),
        sodium=Sum('total_sodium'),
        count=Count('id')
    )
    
    # Comparar con objetivos del usuario
    user = request.user
    goals_progress = None
    if user.has_goals:
        goals_progress = {
            'calories': {
                'consumed': totals['calories'] or 0,
                'goal': user.calories_goal,
                'percentage': round((totals['calories'] or 0) / user.calories_goal * 100, 1)
            },
            'protein': {
                'consumed': totals['protein'] or 0,
                'goal': user.protein_goal,
                'percentage': round((totals['protein'] or 0) / user.protein_goal * 100, 1)
            },
            'carbs': {
                'consumed': totals['carbs'] or 0,
                'goal': user.carbs_goal,
                'percentage': round((totals['carbs'] or 0) / user.carbs_goal * 100, 1)
            },
            'fat': {
                'consumed': totals['fat'] or 0,
                'goal': user.fat_goal,
                'percentage': round((totals['fat'] or 0) / user.fat_goal * 100, 1)
            }
        }
    
    return Response({
        'date': target_date,
        'totals': {
            'calories': round(totals['calories'] or 0, 1),
            'protein': round(totals['protein'] or 0, 1),
            'carbs': round(totals['carbs'] or 0, 1),
            'fat': round(totals['fat'] or 0, 1),
            'fiber': round(totals['fiber'] or 0, 1),
            'sugar': round(totals['sugar'] or 0, 1),
            'sodium': round(totals['sodium'] or 0, 1),
        },
        'count': totals['count'],
        'goals_progress': goals_progress
    })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def period_summary(request):
    """Resumen nutricional por período (semanal, mensual, etc.)"""
    start_date_param = request.GET.get('start_date')
    end_date_param = request.GET.get('end_date')
    period = request.GET.get('period', 'week')  # week, month, custom
    
    today = date.today()
    
    # Determinar fechas según el período
    if period == 'week':
        start_date = today - timedelta(days=today.weekday())
        end_date = start_date + timedelta(days=6)
    elif period == 'month':
        start_date = today.replace(day=1)
        # Último día del mes
        if today.month == 12:
            end_date = today.replace(year=today.year+1, month=1, day=1) - timedelta(days=1)
        else:
            end_date = today.replace(month=today.month+1, day=1) - timedelta(days=1)
    elif period == 'custom':
        if start_date_param and end_date_param:
            try:
                start_date = parse_date(start_date_param)
                end_date = parse_date(end_date_param)
            except ValueError:
                return Response({'error': 'Formato de fecha inválido'}, 
                              status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Se requieren start_date y end_date para período custom'}, 
                          status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Período inválido'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    # Obtener registros del período
    registers = FoodRegister.objects.filter(
        user=request.user,
        created_at__date__gte=start_date,
        created_at__date__lte=end_date,
        status='completed'
    )
    
    # Agrupar por día
    daily_data = {}
    for register in registers:
        day = register.created_at.date()
        if day not in daily_data:
            daily_data[day] = {
                'calories': 0, 'protein': 0, 'carbs': 0, 'fat': 0,
                'fiber': 0, 'sugar': 0, 'sodium': 0, 'count': 0
            }
        
        daily_data[day]['calories'] += register.total_calories or 0
        daily_data[day]['protein'] += register.total_protein or 0
        daily_data[day]['carbs'] += register.total_carbs or 0
        daily_data[day]['fat'] += register.total_fat or 0
        daily_data[day]['fiber'] += register.total_fiber or 0
        daily_data[day]['sugar'] += register.total_sugar or 0
        daily_data[day]['sodium'] += register.total_sodium or 0
        daily_data[day]['count'] += 1
    
    # Calcular totales del período
    period_totals = registers.aggregate(
        calories=Sum('total_calories'),
        protein=Sum('total_protein'),
        carbs=Sum('total_carbs'),
        fat=Sum('total_fat'),
        fiber=Sum('total_fiber'),
        sugar=Sum('total_sugar'),
        sodium=Sum('total_sodium'),
        count=Count('id')
    )
    
    # Formatear datos diarios
    daily_summary = []
    current_date = start_date
    while current_date <= end_date:
        day_data = daily_data.get(current_date, {
            'calories': 0, 'protein': 0, 'carbs': 0, 'fat': 0,
            'fiber': 0, 'sugar': 0, 'sodium': 0, 'count': 0
        })
        
        daily_summary.append({
            'date': current_date,
            'totals': {
                'calories': round(day_data['calories'], 1),
                'protein': round(day_data['protein'], 1),
                'carbs': round(day_data['carbs'], 1),
                'fat': round(day_data['fat'], 1),
                'fiber': round(day_data['fiber'], 1),
                'sugar': round(day_data['sugar'], 1),
                'sodium': round(day_data['sodium'], 1),
            },
            'count': day_data['count']
        })
        current_date += timedelta(days=1)
    
    return Response({
        'period': period,
        'start_date': start_date,
        'end_date': end_date,
        'daily_summary': daily_summary,
        'period_totals': {
            'calories': round(period_totals['calories'] or 0, 1),
            'protein': round(period_totals['protein'] or 0, 1),
            'carbs': round(period_totals['carbs'] or 0, 1),
            'fat': round(period_totals['fat'] or 0, 1),
            'fiber': round(period_totals['fiber'] or 0, 1),
            'sugar': round(period_totals['sugar'] or 0, 1),
            'sodium': round(period_totals['sodium'] or 0, 1),
        },
        'total_count': period_totals['count'],
        'days_in_period': (end_date - start_date).days + 1,
        'days_with_records': len([d for d in daily_data.values() if d['count'] > 0])
    })

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def reanalyze_register(request, register_id):
    """Re-analizar un registro con Gemini"""
    try:
        food_register = FoodRegister.objects.get(
            id=register_id,
            user=request.user
        )
    except FoodRegister.DoesNotExist:
        return Response({'error': 'Registro no encontrado'}, 
                       status=status.HTTP_404_NOT_FOUND)
    
    try:
        # Analizar de nuevo
        analyzer = GeminiAnalyzer()
        new_description = request.data.get('description', food_register.description)
        
        gemini_data = analyzer.analyze_food_image(
            food_register.image, 
            new_description
        )
        
        # Eliminar items anteriores
        food_register.food_items.all().delete()
        
        # Actualizar registro
        food_register.description = new_description
        food_register.ai_description = gemini_data['ai_description']
        food_register.ai_confidence = gemini_data['ai_confidence']
        food_register.total_calories = gemini_data['total_calories']
        food_register.total_protein = gemini_data['total_protein']
        food_register.total_carbs = gemini_data['total_carbs']
        food_register.total_fat = gemini_data['total_fat']
        food_register.total_fiber = gemini_data['total_fiber']
        food_register.total_sugar = gemini_data['total_sugar']
        food_register.total_sodium = gemini_data['total_sodium']
        food_register.estimated_weight = gemini_data['estimated_weight']
        food_register.status = 'completed'
        food_register.save()
        
        # Crear nuevos items
        for item_data in gemini_data['food_items']:
            FoodItem.objects.create(
                food_register=food_register,
                name=item_data['name'],
                category=item_data['category'],
                estimated_quantity=item_data['estimated_quantity'],
                quantity_unit=item_data['quantity_unit'],
                calories=item_data['calories'],
                protein=item_data['protein'],
                carbs=item_data['carbs'],
                fat=item_data['fat'],
                fiber=item_data['fiber'],
                sugar=item_data['sugar'],
                sodium=item_data['sodium'],
                confidence=item_data['confidence']
            )
        
        return Response({
            'message': 'Re-análisis exitoso',
            'register': FoodRegisterSerializer(food_register, context={'request': request}).data
        })
        
    except Exception as e:
        return Response({
            'error': 'Error en re-análisis',
            'details': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

