FROM python:3.11-slim

# Variables de entorno para Python
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements e instalar dependencias Python
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Instalar gunicorn para producción
RUN pip install gunicorn

# Copiar código del backend
COPY . .

# Crear directorios necesarios
RUN mkdir -p staticfiles media data

# Dar permisos de ejecución al script de inicio
RUN chmod +x start.sh

# Exponer puerto
EXPOSE 8000

# Script de inicio
CMD ["./start.sh"]