from django.urls import path
from . import views

urlpatterns = [
    path('dashboard-stats/', views.dashboard_stats, name='admin-dashboard-stats'),
    path('users/', views.users_list, name='admin-users-list'),
    path('users/<int:user_id>/', views.delete_user, name='admin-delete-user'),
    path('meal-plans/', views.meal_plans_list, name='admin-meal-plans-list'),
    path('meal-plans/<int:plan_id>/', views.delete_meal_plan, name='admin-delete-meal-plan'),
    path('registers/', views.registers_list, name='admin-registers-list'),
    path('registers/<int:register_id>/', views.delete_register, name='admin-delete-register'),
    path('conversations/', views.conversations_list, name='admin-conversations-list'),
    path('conversations/<int:conversation_id>/', views.delete_conversation, name='admin-delete-conversation'),
    path('users/<int:user_id>/toggle-active/', views.toggle_user_active, name='admin-toggle-user-active'),
]