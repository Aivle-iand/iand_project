# urls.py

from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.custom_signin_view, name='signin'),
    path('signup', views.custom_signup_view, name='signup'),
    path('signup/submit', views.signup, name='submig_sighup'),
]
