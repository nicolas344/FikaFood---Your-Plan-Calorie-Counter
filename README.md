# FikaFood - Tu Plan de Calorías Personalizado

![FikaFood](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.x-blue.svg)
![Django](https://img.shields.io/badge/Django-5.2.6-green.svg)
![Python](https://img.shields.io/badge/Python-3.8+-green.svg)

FikaFood es una aplicación web moderna que te ayuda a llevar un control detallado de tu alimentación y te guía para seguir un plan nutricional personalizado. Construida con React en el frontend y Django en el backend, integra inteligencia artificial para generar recomendaciones nutricionales personalizadas.

## ✨ Características Principales

- 🔐 **Sistema de Autenticación Completo**: Registro, login y gestión de usuarios
- 📊 **Dashboard Personalizado**: Visualiza tu progreso y estadísticas nutricionales
- 🤖 **Chatbot Nutricional con IA**: Obtén recomendaciones personalizadas usando Google GenAI
- 🎯 **Metas Nutricionales**: Establece y sigue tus objetivos de calorías, proteínas, carbohidratos y grasas
- 💧 **Seguimiento de Hidratación**: Control de consumo diario de agua
- 📱 **Diseño Responsivo**: Interfaz moderna construida con Tailwind CSS

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de JavaScript para interfaces de usuario
- **Vite** - Herramienta de construcción rápida
- **Tailwind CSS** - Framework de CSS utilitario
- **React Router** - Enrutamiento para aplicaciones React
- **Lucide React** - Iconos modernos
- **Axios** - Cliente HTTP para APIs

### Backend
- **Django 5.2.6** - Framework web de Python
- **Django REST Framework** - Toolkit para APIs REST
- **Django REST Framework Simple JWT** - Autenticación JWT para Django
- **Django CORS Headers** - Manejo de CORS
- **Google GenAI** - Integración con IA de Google
- **SQLite3** - Base de datos
- **Python-dotenv** - Gestión de variables de entorno
- **PyJWT** - Manejo de tokens JWT

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [Python](https://www.python.org/) (versión 3.8 o superior)
- [pip](https://pip.pypa.io/en/stable/) (gestor de paquetes de Python)
- [Git](https://git-scm.com/) para clonar el repositorio

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/nicolas344/FikaFood---Your-Plan-Calorie-Counter.git
cd FikaFood---Your-Plan-Calorie-Counter
```

### 2. Configuración del Backend (Django)

#### 2.1 Crear y Activar Entorno Virtual

```bash
cd backend
python -m venv env

# En Windows
env\Scripts\activate

# En macOS/Linux
source env/bin/activate
```

#### 2.2 Instalar Dependencias

```bash
pip install -r requirements.txt
```

#### 2.3 Configurar Variables de Entorno

Crea un archivo `.env` en la carpeta `backend` 
```bash
.env
```

> ⚠️ **Importante**: 
> - Solicita el archivo `.env` completo a los colaboradores del proyecto para obtener las claves API necesarias

#### 2.4 Ejecutar Migraciones

```bash
python manage.py makemigrations
python manage.py migrate
```


#### 2.5 Iniciar Servidor de Desarrollo

```bash
python manage.py runserver
```

El backend estará disponible en: `http://127.0.0.1:8000/`


### 3. Configuración del Frontend (React)

#### 3.1 Navegar a la Carpeta Frontend

Abre una **nueva terminal** y ejecuta:

```bash
cd frontend
```

#### 3.2 Instalar Dependencias

```bash
npm install
```


#### 3.3 Iniciar Servidor de Desarrollo

```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:5173/`

## 🌐 Acceso a la Aplicación

Una vez que ambos servidores estén ejecutándose:

1. **Backend**: `http://127.0.0.1:8000/`
2. **Frontend**: `http://localhost:5173/`
 
