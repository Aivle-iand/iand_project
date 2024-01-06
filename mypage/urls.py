from django.urls import path
from . import views

app_name = 'mypage'
urlpatterns = [
    path('', views.index, name='index'),
    path('mypage_temp', views.mypage_temp, name='mypage_temp'),
    path('mypage_temp/upload_media/', views.upload_media, name='save_media_url'),
]