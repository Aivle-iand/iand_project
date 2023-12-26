from django.urls import path
from . import views
from .views import profile_view


urlpatterns = [
    path('', views.index, name='index'),
    path('profiles/', profile_view, name='profiles'),
] 
