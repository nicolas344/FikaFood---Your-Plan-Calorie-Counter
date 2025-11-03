from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = (
            'email', 'username', 'first_name', 'last_name', 
            'password', 'password_confirm', 'date_of_birth',
            'weight', 'height', 'gender', 'activity_level',
            'objective', 'dietary_preference', 'additional_restrictions'
        )
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Las contraseñas no coinciden")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError('Credenciales inválidas')
            if not user.is_active:
                raise serializers.ValidationError('Usuario inactivo')
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Email y contraseña son requeridos')

class NutritionGoalsSerializer(serializers.Serializer):
    calories = serializers.IntegerField(min_value=800, max_value=5000)
    protein = serializers.IntegerField(min_value=10, max_value=500)
    carbs = serializers.IntegerField(min_value=10, max_value=800)
    fat = serializers.IntegerField(min_value=10, max_value=300)

class WaterGoalSerializer(serializers.Serializer):
    water_ml = serializers.IntegerField(min_value=500, max_value=5000)

class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    age = serializers.ReadOnlyField()
    dietary_info = serializers.SerializerMethodField()
    has_nutrition_goals = serializers.ReadOnlyField()
    has_water_goal = serializers.ReadOnlyField()
    is_superuser = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = User
        fields = (
            'id', 'email', 'username', 'first_name', 'last_name', 'full_name',
            'date_of_birth', 'age', 'weight', 'height', 'gender', 'activity_level',
            'objective', 'dietary_preference', 'additional_restrictions', 'dietary_info',
            'calories_goal', 'protein_goal', 'carbs_goal', 'fat_goal', 'goals_method', 'has_nutrition_goals',
            'water_goal', 'water_method', 'has_water_goal',
            'is_superuser', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'email', 'created_at', 'updated_at', 'is_superuser')
    
    def get_dietary_info(self, obj):
        return obj.get_dietary_info()

class UserUpdateSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = (
            'first_name', 'last_name', 'date_of_birth',
            'weight', 'height', 'gender', 'activity_level',
            'objective', 'dietary_preference', 'additional_restrictions',
            'calories_goal', 'protein_goal', 'carbs_goal', 'fat_goal', 'goals_method',
            'water_goal', 'water_method'
        )

class UserSerializer(serializers.ModelSerializer):
    is_superuser = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_superuser']