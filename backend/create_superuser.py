#!/usr/bin/env python
"""
Script temporal para crear superusuario en Railway
Ejecutar una vez y luego eliminar
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'FikaFood.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Configuración del superusuario
username = 'admin'
email = 'admin@fikafood.com'
password = 'admin123'  # CAMBIAR después de crear

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(
        username=username,
        email=email,
        password=password
    )
    print(f'✅ Superusuario "{username}" creado exitosamente!')
    print(f'⚠️  IMPORTANTE: Cambia la contraseña después de hacer login')
else:
    print(f'❌ El usuario "{username}" ya existe')

