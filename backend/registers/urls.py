from django.urls import path
from . import views

app_name = 'registers'

urlpatterns = [
    path('', views.FoodRegisterListView.as_view(), name='list'),
    path('create/', views.FoodRegisterCreateView.as_view(), name='create'),
    path('<int:pk>/', views.FoodRegisterDetailView.as_view(), name='detail'),
    
    path('daily-summary/', views.daily_summary, name='daily-summary'),
    path('period-summary/', views.period_summary, name='period-summary'),
    path('<int:register_id>/reanalyze/', views.reanalyze_register, name='reanalyze'),
]