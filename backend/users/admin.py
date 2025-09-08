from django.contrib import admin
from .models import User

# Admin básico sin personalización
admin.site.register(User)
