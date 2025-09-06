from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """Usuario personalizado para FikaFood"""
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    
    # Campos específicos para la app de calorías
    date_of_birth = models.DateField(null=True, blank=True)
    weight = models.FloatField(null=True, blank=True, help_text="Peso en kg")
    height = models.FloatField(null=True, blank=True, help_text="Altura en cm")
    gender_choices = [
        ('M', 'Masculino'),
        ('F', 'Femenino'),
        ('O', 'Otro'),
    ]
    gender = models.CharField(max_length=1, choices=gender_choices, null=True, blank=True)
    activity_level_choices = [
        ('sedentary', 'Sedentario'),
        ('light', 'Actividad ligera'),
        ('moderate', 'Actividad moderada'),
        ('active', 'Muy activo'),
        ('extra', 'Extra activo'),
    ]
    activity_level = models.CharField(max_length=10, choices=activity_level_choices, default='sedentary')
    
    # Metas de calorías
    daily_calorie_goal = models.IntegerField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
    
    def __str__(self):
        return f"{self.email} - {self.first_name} {self.last_name}"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    def calculate_bmr(self):
        if not all([self.weight, self.height, self.date_of_birth, self.gender]):
            return None
        
        from datetime import date
        age = (date.today() - self.date_of_birth).days // 365
        
        if self.gender == 'M':
            bmr = 88.362 + (13.397 * self.weight) + (4.799 * self.height) - (5.677 * age)
        else:
            bmr = 447.593 + (9.247 * self.weight) + (3.098 * self.height) - (4.330 * age)
        
        return round(bmr)