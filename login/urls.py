from django.urls import path
from . import views
from django.contrib.auth import views


urlpatterns = [
    path("login/", views.LoginView.as_view(), name='login'),
]
