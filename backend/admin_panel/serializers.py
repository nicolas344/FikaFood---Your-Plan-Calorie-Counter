from rest_framework import serializers
from django.contrib.auth import get_user_model
from registers.models import FoodRegister, FoodItem

User = get_user_model()

class AdminUserListSerializer(serializers.ModelSerializer):
    total_registers = serializers.SerializerMethodField()
    profile_info = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                 'date_joined', 'last_login', 'is_active', 'is_superuser', 'total_registers', 'profile_info']
    
    def get_total_registers(self, obj):
        return FoodRegister.objects.filter(user=obj).count()
    
    def get_profile_info(self, obj):
        try:
            return {
                'age': obj.age,
                'weight': obj.weight,
                'height': obj.height,
                'gender': obj.get_gender_display() if obj.gender else 'No especificado',
            }
        except:
            return None

class AdminRegisterListSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    food_name = serializers.CharField(source='ai_description', read_only=True)
    calories = serializers.FloatField(source='total_calories', read_only=True)
    proteins = serializers.FloatField(source='total_protein', read_only=True)
    carbohydrates = serializers.FloatField(source='total_carbs', read_only=True)
    fats = serializers.FloatField(source='total_fat', read_only=True)
    quantity = serializers.FloatField(source='estimated_weight', read_only=True)
    date = serializers.DateTimeField(source='created_at', read_only=True)
    
    class Meta:
        model = FoodRegister
        fields = ['id', 'user_email', 'food_name', 'description', 'calories', 
                 'proteins', 'carbohydrates', 'fats', 'quantity', 'date']

class DashboardStatsSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    total_registers = serializers.IntegerField()
    total_food_items = serializers.IntegerField()
    active_users = serializers.IntegerField()
    users_this_month = serializers.IntegerField()
    registers_this_month = serializers.IntegerField()