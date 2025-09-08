from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import date


class User(AbstractUser):
    """Usuario personalizado para FikaFood"""
    
    # Campos basicos
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    
    # Informacion personal
    date_of_birth = models.DateField(null=True, blank=True)
    
    GENDER_CHOICES = [
        ('M', 'Masculino'),
        ('F', 'Femenino'),
        ('O', 'Otro'),
    ]
    gender = models.CharField(
        max_length=1, 
        choices=GENDER_CHOICES, 
        null=True, 
        blank=True
    )
    
    # Metricas fisicas
    weight = models.FloatField(null=True, blank=True)
    height = models.FloatField(null=True, blank=True)
    
    ACTIVITY_LEVEL_CHOICES = [
        ('sedentary', '0-2'),
        ('moderate', '3-5'),
        ('active', '6+'),
    ]
    activity_level = models.CharField(
        max_length=20, 
        choices=ACTIVITY_LEVEL_CHOICES, 
        null=True, 
        blank=True
    )
    
    # Campo para objetivo calórico
    OBJECTIVE_CHOICES = [
        ('lose', 'Perder peso'),
        ('maintain', 'Mantener peso'),
        ('gain', 'Aumentar peso'),
    ]
    objective = models.CharField(
        max_length=10, 
        choices=OBJECTIVE_CHOICES, 
        null=True, 
        blank=True
    )

    # Preferencias de dieta y restricciones
    DIETARY_PREFERENCES_CHOICES = [
        ('classic', 'Clásico'),
        ('vegetarian', 'Vegetariano'),
        ('vegan', 'Vegano'),
        ('pescetarian', 'Pescetariano'),
    ]
    dietary_preference = models.CharField(
        max_length=20, 
        choices=DIETARY_PREFERENCES_CHOICES, 
        default='classic'
    )
    
    additional_restrictions = models.TextField(null=True, blank=True)
    
    # ===== METAS SIMPLES =====
    calories_goal = models.IntegerField(null=True, blank=True)
    protein_goal = models.IntegerField(null=True, blank=True) 
    carbs_goal = models.IntegerField(null=True, blank=True)
    fat_goal = models.IntegerField(null=True, blank=True)
    goals_method = models.CharField(max_length=10, choices=[('manual', 'Manual'), ('ai', 'IA')], null=True, blank=True)

    # ===== AGUA SIMPLE =====
    water_goal = models.IntegerField(null=True, blank=True)
    water_method = models.CharField(max_length=10, choices=[('manual', 'Manual'), ('ai', 'IA')], null=True, blank=True)

    # ===== METADATOS =====
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # ===== CONFIGURACIÓN DE AUTENTICACIÓN =====
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
    
    def __str__(self):
        return f"{self.email} - {self.first_name} {self.last_name}"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def age(self):
        if not self.date_of_birth:
            return None
        return (date.today() - self.date_of_birth).days // 365
    
    @property
    def has_goals(self):
        """Solo verifica si tiene los 4 valores"""
        return all([
            self.calories_goal,
            self.protein_goal,
            self.carbs_goal,
            self.fat_goal
        ])
    
    @property
    def has_nutrition_goals(self):
        """Alias para has_goals para consistencia con el frontend"""
        return self.has_goals
    
    @property
    def has_water_goal(self):
        """Verifica si el usuario tiene una meta de agua establecida"""
        return self.water_goal is not None and self.water_goal > 0
    
    def get_dietary_info(self):
        """Retorna información dietética completa"""
        return {
            'preference': self.get_dietary_preference_display() if self.dietary_preference else 'No especificado',
            'additional_restrictions': self.additional_restrictions or 'Ninguna'
        }