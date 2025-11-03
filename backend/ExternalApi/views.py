import requests
from django.http import JsonResponse


def productos(request):
    response = requests.get("https://comercia-1.onrender.com/es/api/products/")
    data = response.json()
    return JsonResponse(data)
