# urls.py

from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.custom_signin_view, name='signin'),
    path('signup', views.custom_signup_view, name='signup'),
    path('signup/submit', views.signup, name='submig_sighup'),
    path('signup/check_id_dup', views.check_user_id, name='check_id_dup'),
    path('signup/check_nickname_dup', views.check_nickname, name='check_nickname_dup'),
]
