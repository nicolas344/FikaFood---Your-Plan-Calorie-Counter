from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .services import MealPlanService
from .models import MealPlan
from .serializers import MealPlanSerializer
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def generate_mealplan(request):
    service = MealPlanService()
    try:
        plan_text = service.generate_mealplan(request.user)
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