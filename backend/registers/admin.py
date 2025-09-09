from django.contrib import admin
from .models import FoodRegister, FoodItem
# Admin básico sin personalización
admin.site.register(FoodRegister)
admin.site.register(FoodItem)
