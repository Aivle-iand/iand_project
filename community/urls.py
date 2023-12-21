# blog/urls.py
from django.urls import path
from . import views

app_name = 'community'
urlpatterns = [
    path('', views.announcement, name='announcement'),
    path('freeboard', views.freeboard, name='freeboard'),
    path('qna', views.qna, name='qna'),
]
