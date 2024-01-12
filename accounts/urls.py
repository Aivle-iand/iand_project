from allauth.account.views import LoginView, LogoutView
from django.urls import path, include
from . import views
from allauth.socialaccount.views import SignupView
from .views import CustomSocialSignupView, CustomLoginView, get_client_ip

urlpatterns = [
    path('login/', CustomLoginView.as_view(), name="account_login"),
    path('logout/', LogoutView.as_view(), name="logout"),
    path("social/signup/", CustomSocialSignupView.as_view(), name="social_signup"),
    path('signup/', SignupView.as_view(), name="account_signup"),
    path('signup/check_username_dup', views.check_username, name="check_username_dup"),
    path('signup/check_nickname_dup', views.check_nickname, name="check_nickname_dup"),
    path('social/signup/social_check_nickname_dup', views.social_check_nickname, name="social_check_nickname_dup"),
    path('', include('allauth.urls')),
    path('get_client_ip/', get_client_ip, name='get_client_ip'),
]