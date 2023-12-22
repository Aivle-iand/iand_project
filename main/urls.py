# urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.custom_main_view, name='main'),
]
