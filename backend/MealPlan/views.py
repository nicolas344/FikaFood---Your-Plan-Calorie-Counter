from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .services import MealPlanService
from .models import MealPlan
from .serializers import MealPlanSerializer
from .pdf_generators import (
    MealPlanPDFService,
    PlainMealPlanPDFGenerator,
    StyledMealPlanPDFGenerator,
)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def generate_mealplan(request):
    service = MealPlanService()
    language = request.data.get('language', 'es')
    try:
        plan_text = service.generate_mealplan(request.user, language=language)
        return Response({
            "success": True,
            "plan": plan_text
        })
    except Exception as e:
        return Response({
            "success": False,
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_mealplans(request):
    plans = MealPlan.objects.filter(user=request.user).order_by("-created_at")
    serializer = MealPlanSerializer(plans, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_mealplan(request, plan_id):
    try:
        plan = MealPlan.objects.get(id=plan_id, user=request.user)
        serializer = MealPlanSerializer(plan)
        return Response(serializer.data)
    except MealPlan.DoesNotExist:
        return Response({
            "success": False,
            "error": "Plan no encontrado"
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def download_mealplan_pdf(request, plan_id):
    style = (request.GET.get("style") or "simple").lower()
    generator_map = {
        "simple": PlainMealPlanPDFGenerator(),
        "estilizado": StyledMealPlanPDFGenerator(),
        "styled": StyledMealPlanPDFGenerator(),
    }
    generator = generator_map.get(style)
    if generator is None:
        return Response({
            "success": False,
            "error": "Estilo de PDF no soportado"
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        meal_plan = MealPlan.objects.get(id=plan_id, user=request.user)
    except MealPlan.DoesNotExist:
        return Response({
            "success": False,
            "error": "Plan no encontrado"
        }, status=status.HTTP_404_NOT_FOUND)

    pdf_service = MealPlanPDFService(generator)
    pdf_bytes = pdf_service.export(meal_plan)

    filename = f"plan_{meal_plan.start_date}_{meal_plan.end_date}.pdf"
    response = HttpResponse(pdf_bytes, content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="{filename}"'
    return response