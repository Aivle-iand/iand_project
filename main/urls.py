from django.urls import path, include
from . import views
from django.contrib.auth import views as auth_views

app_name = 'main'

urlpatterns = [
    path('', views.custom_main_view, name='main'),
    path('accounts/', include('login.urls')),
    path('accounts/', include('allauth.urls')),
    path('accounts/logout/', views.custom_logout_view, name='logout_site'),
]