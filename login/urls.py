# urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.custom_login_view, name='login'),
    path('signup', views.custom_signup_view, name='signup'),
    
]
