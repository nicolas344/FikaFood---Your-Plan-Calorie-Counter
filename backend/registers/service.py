import google.generativeai as genai
import os
import json
import logging
from PIL import Image

logger = logging.getLogger(__name__)

class GeminiAnalyzer:
    """Servicio simple para analizar imágenes con Gemini"""
    
    def __init__(self):
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY no configurado")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash-lite')
    
    def analyze_food_image(self, image_file, user_description=""):
        """Analiza imagen y retorna datos nutricionales"""
        try:
            # Preparar imagen
            image = self._prepare_image(image_file)
            
            # Crear prompt
            prompt = self._create_prompt(user_description)
            
            # Llamar a Gemini
            response = self.model.generate_content([prompt, image])
            
            # Procesar respuesta
            return self._process_response(response.text)
            
        except Exception as e:
            logger.error(f"Error Gemini: {str(e)}")
            raise Exception(f"Error al analizar imagen: {str(e)}")
    
    def _prepare_image(self, image_file):
        """Prepara imagen para Gemini"""
        image = Image.open(image_file)
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Redimensionar si es muy grande
        if image.width > 2048 or image.height > 2048:
            image.thumbnail((2048, 2048), Image.Resampling.LANCZOS)
        
        return image
    
    def _create_prompt(self, user_description):
        """Crea el prompt para Gemini"""
        prompt = f"""
        Analiza esta imagen de comida y dame información nutricional detallada.
        la resupuesta debe ser corta y concisa liviana, y efiencente
        RESPONDE SOLO CON JSON VÁLIDO:
        EJEMPLO:
        {{
            "ai_description": "Descripción detallada de la comida",
            "ai_confidence": 0.85,
            "estimated_weight": 300,
            "total_calories": 450,
            "total_protein": 25.5,
            "total_carbs": 45.0,
            "total_fat": 15.2,
            "total_fiber": 8.5,
            "total_sugar": 5.2,
            "total_sodium": 890,
            "food_items": [
                {{
                    "name": "Pollo a la plancha",
                    "category": "Proteína",
                    "estimated_quantity": 120,
                    "quantity_unit": "gramos",
                    "calories": 198,
                    "protein": 22.5,
                    "carbs": 0,
                    "fat": 11.2,
                    "fiber": 0,
                    "sugar": 0,
                    "sodium": 65,
                    "confidence": 0.9
                }}
            ]
        }}
        """
        
        if user_description:
            prompt += f"\n\nDescripción del usuario: {user_description}"
        
        return prompt
    
    def _process_response(self, response_text):
        """Procesa la respuesta de Gemini"""
        try:

            # Limpiar respuesta
            cleaned = response_text.strip()
            if cleaned.startswith('```json'):
                cleaned = cleaned[7:]
            if cleaned.endswith('```'):
                cleaned = cleaned[:-3]
            cleaned = cleaned.strip()
            
            # Parsear JSON
            data = json.loads(cleaned)
            
            # Validar datos básicos
            required_fields = ['ai_description', 'ai_confidence', 'total_calories', 'food_items']
            for field in required_fields:
                if field not in data:
                    raise ValueError(f"Campo {field} faltante")
            
            # Asegurar valores mínimos
            data['ai_confidence'] = max(0, min(1, float(data.get('ai_confidence', 0.5))))
            data['estimated_weight'] = max(10, float(data.get('estimated_weight', 100)))
            data['total_calories'] = max(0, float(data.get('total_calories', 0)))
            data['total_protein'] = max(0, float(data.get('total_protein', 0)))
            data['total_carbs'] = max(0, float(data.get('total_carbs', 0)))
            data['total_fat'] = max(0, float(data.get('total_fat', 0)))
            data['total_fiber'] = max(0, float(data.get('total_fiber', 0)))
            data['total_sugar'] = max(0, float(data.get('total_sugar', 0)))
            data['total_sodium'] = max(0, float(data.get('total_sodium', 0)))
            
            return data
            
        except json.JSONDecodeError:
            raise Exception("Respuesta de Gemini no es JSON válido")
        except Exception as e:
            raise Exception(f"Error procesando respuesta: {str(e)}")