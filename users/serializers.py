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
            'weight', 'height', 'gender', 'activity_level'
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

class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    bmr = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = (
            'id', 'email', 'username', 'first_name', 'last_name', 'full_name',
            'date_of_birth', 'weight', 'height', 'gender', 'activity_level',
            'daily_calorie_goal', 'bmr', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'email', 'created_at', 'updated_at')
    
    def get_bmr(self, obj):
        return obj.calculate_bmr()

class UserUpdateSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = (
            'first_name', 'last_name', 'date_of_birth',
            'weight', 'height', 'gender', 'activity_level', 'daily_calorie_goal'
        )