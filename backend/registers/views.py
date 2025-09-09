from django.shortcuts import render
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Sum, Count
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
    """Listar registros del usuario"""
    serializer_class = FoodRegisterSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return FoodRegister.objects.filter(user=self.request.user)

class FoodRegisterDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Ver, actualizar o eliminar registro"""
    serializer_class = FoodRegisterSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return FoodRegister.objects.filter(user=self.request.user)
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = FoodRegisterUpdateSerializer(instance, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Registro actualizado',
                'register': FoodRegisterSerializer(instance).data
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def daily_summary(request):
    """Resumen nutricional del día"""
    from datetime import date
    
    today = date.today()
    
    # Obtener registros del día
    registers = FoodRegister.objects.filter(
        user=request.user,
        created_at__date=today,
        status='completed'
    )
    
    if not registers.exists():
        return Response({
            'date': today,
            'message': 'No hay registros hoy',
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
        'date': today,
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