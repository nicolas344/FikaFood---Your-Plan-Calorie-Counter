from rest_framework import serializers
from .models import FoodRegister, FoodItem

class FoodItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodItem
        fields = '__all__'

class FoodRegisterCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodRegister
        fields = ['image', 'description']
    
    def validate_image(self, value):
        # Validar tamaño máximo 10MB
        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError("Imagen muy grande. Máximo 10MB")
        
        # Validar formato
        valid_formats = ['jpg', 'jpeg', 'png', 'webp']
        extension = value.name.split('.')[-1].lower()
        if extension not in valid_formats:
            raise serializers.ValidationError(f"Formato inválido. Use: {', '.join(valid_formats)}")
        
        return value

class FoodRegisterSerializer(serializers.ModelSerializer):
    food_items = FoodItemSerializer(many=True, read_only=True)
    nutrition_summary = serializers.ReadOnlyField(source='get_nutrition_summary')
    macros_distribution = serializers.ReadOnlyField()
    
    class Meta:
        model = FoodRegister
        fields = '__all__'

class FoodRegisterUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodRegister
        fields = [
            'description', 'total_calories', 'total_protein', 'total_carbs',
            'total_fat', 'total_fiber', 'total_sugar', 'total_sodium',
            'estimated_weight'
        ]