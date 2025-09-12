from google import genai
from google.genai import types
from .models import Conversation, Message
import os
import json
import re

class ChatbotService:
    def __init__(self):
        self.api_key = os.environ.get("GEMINI_API_KEY")
        if not self.api_key:
            raise Exception("GEMINI_API_KEY no encontrada")
        
        self.client = genai.Client(api_key=self.api_key)
        self.model = "gemini-1.5-flash"
        
    def get_user_context(self, user):
        """Información básica del usuario"""
        context = f"Usuario: {user.full_name}\n"
        
        if user.age:
            context += f"Edad: {user.age}\n"
        if user.weight:
            context += f"Peso: {user.weight}kg\n"
        if user.height:
            context += f"Altura: {user.height}cm\n"
        if user.objective:
            context += f"Objetivo: {user.get_objective_display()}\n"
        if user.activity_level:
            context += f"Actividad: {user.get_activity_level_display()}\n"
        if user.dietary_preference:
            context += f"Dieta: {user.get_dietary_preference_display()}\n"
            
        # Metas actuales si las tiene
        if user.has_goals:
            context += f"\nMetas actuales:\n"
            context += f"Calorías: {user.calories_goal}\n"
            context += f"Proteína: {user.protein_goal}g\n"
            context += f"Carbohidratos: {user.carbs_goal}g\n"
            context += f"Grasa: {user.fat_goal}g\n"
            
        return context
    
    def _is_goals_request(self, message):
        """Detecta si pide generar metas"""
        keywords = ['genera', 'crea', 'metas', 'objetivos', 'macros', 'calorías']
        return any(word in message.lower() for word in keywords)
    
    def _save_ai_goals(self, user, goals_text):
        """Guarda metas nutricionales de IA"""
        try:
            import re
            cal_match = re.search(r'calorías.*?(\d{3,4})', goals_text.lower())
            prot_match = re.search(r'proteína.*?(\d{1,3})g', goals_text.lower())
            carb_match = re.search(r'carbohidratos.*?(\d{1,3})g', goals_text.lower())
            fat_match = re.search(r'grasa.*?(\d{1,3})g', goals_text.lower())
            
            if all([cal_match, prot_match, carb_match, fat_match]):
                user.calories_goal = int(cal_match.group(1))
                user.protein_goal = int(prot_match.group(1))
                user.carbs_goal = int(carb_match.group(1))
                user.fat_goal = int(fat_match.group(1))
                user.goals_method = 'ai'
                user.save()
                return True
        except:
            pass
        return False
    
    def _save_ai_water(self, user, text):
        """Buscar números de agua y guardar"""
        import re
        # Buscar "2500ml" o "2.5 litros"
        ml_match = re.search(r'(\d{3,4})\s*ml', text.lower())
        if ml_match:
            user.water_goal = int(ml_match.group(1))
            user.water_method = 'ai'
            user.save()
            return True
        return False

    def generate_response(self, user_message, user, conversation=None):
        try:
            # Crear conversación si no existe
            if not conversation:
                conversation = Conversation.objects.create(user=user)
            
            # Guardar mensaje del usuario
            Message.objects.create(
                conversation=conversation,
                role='user',
                content=user_message
            )
            
            user_context = self.get_user_context(user)
            
            # Detectar si es solicitud de agua
            if 'agua' in user_message.lower() or 'hidrat' in user_message.lower():
                prompt = f"""Eres un nutricionista especializado en hidratación.

{user_context}

Calcula cuánta agua debe beber usando esta fórmula:
- Peso × 35ml = base
- Si actividad moderate: +300ml
- Si actividad active: +500ml

Ejemplo: 70kg × 35ml = 2450ml + actividad = total

Responde EXACTAMENTE así:
"Agua recomendada: 2750ml"

Usuario pregunta: {user_message}"""

            elif 'meta' in user_message.lower() and ('nutri' in user_message.lower() or 'calor' in user_message.lower()):
                prompt = f"""Eres un nutricionista en FikaFood. 

{user_context}

Calcula metas nutricionales personalizadas.

Responde EXACTAMENTE así:
"Calorías: 2000
Proteína: 150g
Carbohidratos: 250g
Grasa: 67g"

Usuario: {user_message}"""

            else:
                prompt = f"""Eres un nutricionista en FikaFood. 

{user_context}

Responde como experto en nutrición. Si preguntan sobre metas, diles que escriban:
- "genera mis metas nutricionales" 
- "cuánta agua debo beber"

Usuario: {user_message}"""
            
            # Obtener respuesta de IA
            contents = [
                types.Content(
                    role="user",
                    parts=[types.Part.from_text(text=prompt)]
                )
            ]
            
            config = types.GenerateContentConfig(
                temperature=0.7,
                max_output_tokens=2000,
            )
            
            response_text = ""
            for chunk in self.client.models.generate_content_stream(
                model=self.model,
                contents=contents,
                config=config,
            ):
                if hasattr(chunk, 'text') and chunk.text:
                    response_text += chunk.text
            
            # Guardar según tipo de solicitud
            if 'agua' in user_message.lower():
                if self._save_ai_water(user, response_text):
                    response_text += "\n\n✅ ¡Meta de agua guardada!"
                else:
                    response_text += "\n\n❌ No pude guardar automáticamente."
            
            elif 'meta' in user_message.lower():
                if self._save_ai_goals(user, response_text):
                    response_text += "\n\n✅ ¡Metas nutricionales guardadas!"
                else:
                    response_text += "\n\n❌ No pude guardar automáticamente."
            
            # Guardar respuesta
            Message.objects.create(
                conversation=conversation,
                role='assistant',
                content=response_text
            )
            
            return {
                'response': response_text,
                'conversation_id': conversation.id,
                'success': True
            }
            
        except Exception as e:
            return {
                'response': "Error al procesar tu mensaje.",
                'conversation_id': conversation.id if conversation else None,
                'success': False
            }