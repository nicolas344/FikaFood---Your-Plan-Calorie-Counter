from django.db import models
from django.conf import settings

class MealPlan(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name="meal_plans"
    )
    start_date = models.DateField()
    end_date = models.DateField()
    plan = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Plan semanal de {self.user.username} ({self.start_date} - {self.end_date})"