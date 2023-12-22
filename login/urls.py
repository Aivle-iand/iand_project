# urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.custom_login_view, name='login'),
]
