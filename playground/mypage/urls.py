from django.urls import path
from . import views

app_name = 'mypage'
urlpatterns = [
    path('', views.index, name='index'),
    path('mypage_temp', views.mypage_temp, name='mypage_temp'),
    path('upload_img', views.upload_img, name='upload_img'),
    path('upload_voice', views.upload_voice, name='upload_voice'),
]