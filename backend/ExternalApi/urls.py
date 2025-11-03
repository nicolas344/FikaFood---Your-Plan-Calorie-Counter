from django.urls import path
from . import views
from .views import UserListView

urlpatterns = [
    path("productos/", views.productos, name="productos"),
    path('users/', UserListView.as_view(), name='user-list'),
]
