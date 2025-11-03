from django.urls import path
from . import views
urlpatterns = [
    path('generate/', views.generate_mealplan, name="generate_mealplan"),
    path("", views.list_mealplans, name="list_mealplans"),                # GET lista
    path("<int:plan_id>/", views.get_mealplan, name="get_mealplan"),      # GET detalle
    path("<int:plan_id>/pdf/", views.download_mealplan_pdf, name="download_mealplan_pdf"),
]

