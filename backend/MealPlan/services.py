from google import genai
from google.genai import types
from datetime import datetime, timedelta
import re
from django.conf import settings
from .models import MealPlan
import os


class MealPlanService:
    def __init__(self):
        self.api_key = os.environ.get("GEMINI_API_KEY")
        if not self.api_key:
            raise Exception("GEMINI_API_KEY no encontrada")

        self.client = genai.Client(api_key=self.api_key)
        self.model = "gemini-1.5-flash"

    def get_user_context(self, user):
        context = f"Usuario: {user.full_name}\n"
        if hasattr(user, "age") and user.age:
            context += f"Edad: {user.age}\n"
        if hasattr(user, "weight") and user.weight:
            context += f"Peso: {user.weight}kg\n"
        if hasattr(user, "height") and user.height:
            context += f"Altura: {user.height}cm\n"
        if hasattr(user, "objective") and user.objective:
            context += f"Objetivo: {user.get_objective_display()}\n"
        if hasattr(user, "activity_level") and user.activity_level:
            context += f"Actividad: {user.get_activity_level_display()}\n"
        if hasattr(user, "dietary_preference") and user.dietary_preference:
            context += f"Dieta: {user.get_dietary_preference_display()}\n"
        return context

    def parse_plan(self, response_text):
        """
        Convierte el texto generado en un dict estructurado por día
        """
        plan = {}
        dias = re.findall(r"Día\s*(\d+)(.*?)(?=Día\s*\d+|$)", response_text, re.DOTALL | re.IGNORECASE)
        for dia, contenido in dias:
            desayuno = re.search(r"Desayuno[:\-]\s*(.*?)(?=Almuerzo)", contenido, re.DOTALL | re.IGNORECASE)
            almuerzo = re.search(r"Almuerzo[:\-]\s*(.*?)(?=Cena)", contenido, re.DOTALL | re.IGNORECASE)
            cena = re.search(r"Cena[:\-]\s*(.*)", contenido, re.DOTALL | re.IGNORECASE)

            # Buscar si dentro de la cena hay una "Nota:"
            nota = None
            if cena:
                partes = re.split(r"\*\*?Nota:?|\bNota:?", cena.group(1), maxsplit=1, flags=re.IGNORECASE)
                cena_texto = partes[0].strip()
                if len(partes) > 1:
                    nota = partes[1].strip()
            else:
                cena_texto = ""

            plan[f"Día {dia}"] = {
                "desayuno": desayuno.group(1).strip() if desayuno else "",
                "almuerzo": almuerzo.group(1).strip() if almuerzo else "",
                "cena": cena_texto,
            }

            # Guardamos la nota global al final
            if nota:
                plan["nota"] = nota

        return plan

    def generate_mealplan(self, user):
        user_context = self.get_user_context(user)

        prompt = f"""Eres un nutricionista en FikaFood.

{user_context}

Genera un plan alimenticio de 7 días con desayuno, almuerzo y cena.
Respóndelo EXACTAMENTE en este formato:

Día 1
Desayuno: ...
Almuerzo: ...
Cena: ...

Día 2
Desayuno: ...
Almuerzo: ...
Cena: ...
"""

        contents = [
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=prompt)]
            )
        ]

        config = types.GenerateContentConfig(
            temperature=0.7,
            max_output_tokens=1500,
        )

        response_text = ""
        for chunk in self.client.models.generate_content_stream(
            model=self.model,
            contents=contents,
            config=config,
        ):
            if hasattr(chunk, "text") and chunk.text:
                response_text += chunk.text

        # Parsear y guardar en BD
        parsed_plan = self.parse_plan(response_text)
        today = datetime.today().date()

        MealPlan.objects.create(
            user=user,
            start_date=today,
            end_date=today + timedelta(days=7),
            plan=parsed_plan  # guardamos como JSON estructurado
        )

        return parsed_plan
