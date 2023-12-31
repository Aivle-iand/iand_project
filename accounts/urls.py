from allauth.account.views import LoginView, LogoutView
from django.urls import path, include
from . import views
from allauth.socialaccount.views import SignupView

urlpatterns = [
    path('login/', LoginView.as_view(), name="login"),
    path('logout/', LogoutView.as_view(), name="logout"),
    path('signup/', SignupView.as_view(), name="account_signup"),
    path('signup/check_username_dup', views.check_username, name="check_username_dup"),
    # path('signup/check_nickname_dup', views.check_nickname, name="check_nickname_dup"),
    path('', include('allauth.urls')),
]