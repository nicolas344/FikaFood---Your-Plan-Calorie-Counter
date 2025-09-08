import requests
import json

BASE_URL = "http://127.0.0.1:8000/api/auth"

def test_register():
    """Probar registro de usuario"""
    url = f"{BASE_URL}/register/"
    data = {
        "email": "test@example.com",
        "username": "testuser",
        "first_name": "Test",
        "last_name": "User",
        "password": "testpassword123",
        "password_confirm": "testpassword123",
        "weight": 70.5,
        "height": 175,
        "gender": "M",
        "activity_level": "moderate"
    }
    
    response = requests.post(url, json=data)
    print("🔐 REGISTRO:")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.json()

def test_login():
    """Probar login"""
    url = f"{BASE_URL}/login/"
    data = {
        "email": "test@example.com",
        "password": "testpassword123"
    }
    
    response = requests.post(url, json=data)
    print("\n🚪 LOGIN:")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.json()

def test_profile(access_token):
    """Probar obtener perfil"""
    url = f"{BASE_URL}/profile/"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
    response = requests.get(url, headers=headers)
    print("\n👤 PERFIL:")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

def test_dashboard(access_token):
    """Probar dashboard"""
    url = f"{BASE_URL}/dashboard/"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
    response = requests.get(url, headers=headers)
    print("\n📊 DASHBOARD:")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

def test_update_profile(access_token):
    """Probar actualizar perfil"""
    url = f"{BASE_URL}/profile/"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    data = {
        "weight": 75.0,
        "daily_calorie_goal": 2000
    }
    
    response = requests.patch(url, json=data, headers=headers)
    print("\n✏️ ACTUALIZAR PERFIL:")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

if __name__ == "__main__":
    print("🧪 Probando API de FikaFood...")
    print("=" * 50)
    
    try:
        # 1. Probar registro
        register_response = test_register()
        
        # 2. Probar login
        login_response = test_login()
        
        # Obtener token de acceso
        if 'tokens' in login_response:
            access_token = login_response['tokens']['access']
            
            # 3. Probar perfil
            test_profile(access_token)
            
            # 4. Probar dashboard
            test_dashboard(access_token)
            
            # 5. Probar actualizar perfil
            test_update_profile(access_token)
            
        print("\n✅ ¡Todas las pruebas completadas!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Error: No se puede conectar al servidor.")
        print("Asegúrate de que el servidor esté corriendo con: python manage.py runserver")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
