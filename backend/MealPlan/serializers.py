from rest_framework import serializers
from .models import MealPlan

class MealPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealPlan
        fields = ["id", "user", "start_date", "end_date", "plan", "created_at"]
        read_only_fields = ["user", "created_at"]
