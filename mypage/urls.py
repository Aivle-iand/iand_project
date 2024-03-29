from django.urls import path, include
from . import views

app_name = 'mypage'
urlpatterns = [
    path('', views.index, name='index'),
    path('mypage_temp', views.mypage_temp, name='mypage_temp'),
    path('mypage_temp/upload_media/', views.upload_media, name='save_media_url'),
    path('mypage_temp/check_nickname', views.check_nickname, name='check_nickname'),
    path('mypage_temp/check-current-password', views.check_current_password, name='check_current_password'),
    path('mypage_temp/change_nickname', views.change_nickname, name='change_nickname'),
    path('mypage_temp/change_password', views.change_password, name='change_password'),
    path('mypage_temp/delete_account', views.delete_account, name='delete_account'),
    path('mypage_temp/check_api_user', views.check_api_user, name='check_api_user'),
    path('check_pin_pwd', views.check_pin_pwd, name='check_pin_pwd'),
    path('accounts/', include('allauth.urls')),
]