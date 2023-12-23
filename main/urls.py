from django.urls import path, include
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', views.custom_main_view, name='main'),
    path('accounts/', include('allauth.urls')),
    # path('accounts/', views., name='login'),
    path('accounts/logout/', auth_views.LogoutView.as_view(), name='logout'),
]