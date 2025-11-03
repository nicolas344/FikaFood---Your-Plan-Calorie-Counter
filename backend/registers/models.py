from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid
import os
User = get_user_model()


def food_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return os.path.join('food_images', str(instance.user.id), filename)

class FoodRegister(models.Model):

    objects = None
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='food_registers')
    image = models.ImageField(upload_to=food_image_upload_path)
    description = models.TextField(
        max_length=500,
        blank=True,
        help_text="Descripcion opcional del usuario"
    )

    #analisis de IA
    ai_description = models.TextField(
        blank=True,
        help_text="Descripcion generada por Gemini de la imagen"
    )

    ai_confidence = models.FloatField(
        validators=[MinValueValidator(0), MaxValueValidator(1)],
        help_text="Nivel de confianza del análisis de IA (0.0 - 1.0)"
    )

    # Información nutricional total del plato
    total_calories = models.FloatField(
        validators=[MinValueValidator(0)],
        help_text="Calorías totales estimadas"
    )
    total_protein = models.FloatField(
        validators=[MinValueValidator(0)],
        help_text="Proteínas totales en gramos"
    )
    total_carbs = models.FloatField(
        validators=[MinValueValidator(0)],
        help_text="Carbohidratos totales en gramos"
    )
    total_fat = models.FloatField(
        validators=[MinValueValidator(0)],
        help_text="Grasas totales en gramos"
    )
    total_fiber = models.FloatField(
        validators=[MinValueValidator(0)],
        default=0,
        help_text="Fibra total en gramos"
    )
    total_sugar = models.FloatField(
        validators=[MinValueValidator(0)],
        default=0,
        help_text="Azúcares totales en gramos"
    )
    total_sodium = models.FloatField(
        validators=[MinValueValidator(0)],
        default=0,
        help_text="Sodio total en miligramos"
    )

    estimated_weight = models.FloatField(
        validators=[MinValueValidator(0)],
        help_text="Peso estimado del plato en gramos"
    )
    
    gemini_model_used = models.CharField(
        max_length=50,
        default="gemini-2.5-flash-lite",
        help_text="Modelo de Gemini utilizado para el análisis"
    )
    analysis_timestamp = models.DateTimeField(auto_now_add=True)
    
    STATUS_CHOICES = [
        ('analyzing', 'Analizando'),
        ('completed', 'Completado'),
        ('failed', 'Error en análisis'),
        ('reviewing', 'En revisión'),
    ]
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='analyzing'
    )
    

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Registro de Comida"
        verbose_name_plural = "Registros de Comida"
    
    def __str__(self):
        return f"{self.user.email} - {self.created_at.strftime('%Y-%m-%d %H:%M')} - {self.total_calories:.0f} cal"
    
    @property
    def nutrition_density(self):
        """Calcula la densidad nutricional (nutrientes por caloría)"""
        if self.total_calories > 0:
            return {
                'protein_per_cal': round(self.total_protein / self.total_calories * 100, 2),
                'carbs_per_cal': round(self.total_carbs / self.total_calories * 100, 2),
                'fat_per_cal': round(self.total_fat / self.total_calories * 100, 2),
            }
        return {'protein_per_cal': 0, 'carbs_per_cal': 0, 'fat_per_cal': 0}
    
    @property
    def macros_distribution(self):
        """Calcula la distribución porcentual de macronutrientes"""
        total_macros = self.total_protein + self.total_carbs + self.total_fat
        if total_macros > 0:
            return {
                'protein_percent': round((self.total_protein / total_macros) * 100, 1),
                'carbs_percent': round((self.total_carbs / total_macros) * 100, 1),
                'fat_percent': round((self.total_fat / total_macros) * 100, 1),
            }
        return {'protein_percent': 0, 'carbs_percent': 0, 'fat_percent': 0}
    
    def get_nutrition_summary(self):
        """Retorna un resumen nutricional completo"""
        return {
            'calories': self.total_calories,
            'macros': {
                'protein': self.total_protein,
                'carbs': self.total_carbs,
                'fat': self.total_fat,
            },
            'micros': {
                'fiber': self.total_fiber,
                'sugar': self.total_sugar,
                'sodium': self.total_sodium,
            },
            'distribution': self.macros_distribution,
            'density': self.nutrition_density,
            'weight': self.estimated_weight,
            'confidence': self.ai_confidence,
        }

class FoodItem(models.Model):
    """Modelo para alimentos individuales detectados en un registro"""
    
    food_register = models.ForeignKey(
        FoodRegister, 
        on_delete=models.CASCADE, 
        related_name='food_items'
    )
    
    # Información del alimento
    name = models.CharField(max_length=200, help_text="Nombre del alimento detectado")
    category = models.CharField(
        max_length=100, 
        help_text="Categoría del alimento (verdura, proteína, carbohidrato, etc.)"
    )
    
    # Cantidad estimada
    estimated_quantity = models.FloatField(
        validators=[MinValueValidator(0)],
        help_text="Cantidad estimada del alimento"
    )
    quantity_unit = models.CharField(
        max_length=20,
        default="gramos",
        help_text="Unidad de medida (gramos, tazas, piezas, etc.)"
    )
    
    # Información nutricional individual
    calories = models.FloatField(validators=[MinValueValidator(0)])
    protein = models.FloatField(validators=[MinValueValidator(0)])
    carbs = models.FloatField(validators=[MinValueValidator(0)])
    fat = models.FloatField(validators=[MinValueValidator(0)])
    fiber = models.FloatField(validators=[MinValueValidator(0)], default=0)
    sugar = models.FloatField(validators=[MinValueValidator(0)], default=0)
    sodium = models.FloatField(validators=[MinValueValidator(0)], default=0)
    
    # Confianza específica del item
    confidence = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)],
        help_text="Confianza del reconocimiento de este alimento específico"
    )
    
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-calories']  # Ordenar por calorías descendente
        verbose_name = "Alimento Individual"
        verbose_name_plural = "Alimentos Individuales"
    
    def __str__(self):
        return f"{self.name} - {self.estimated_quantity}{self.quantity_unit} - {self.calories:.0f} cal"
    
    @property
    def calories_per_100g(self):
        """Calcula calorías por 100g para comparación"""
        if self.quantity_unit == "gramos" and self.estimated_quantity > 0:
            return round((self.calories / self.estimated_quantity) * 100, 1)
        return None