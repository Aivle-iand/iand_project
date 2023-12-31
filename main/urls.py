from django.urls import path, include
from . import views
from django.contrib.auth.views import LogoutView

app_name = 'main'

urlpatterns = [
    path('', views.custom_main_view, name='main'),
    path('accounts/', include('allauth.urls')),
    path('accounts/logout/', LogoutView.as_view(), name='logout'),
]