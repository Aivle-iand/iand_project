# blog/urls.py
from django.urls import path
from . import views
from django.contrib import admin
from community.views import *

app_name = 'community'
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.announcement, name='announcement'),
    path('freeboard', views.freeboard, name='freeboard'),
    path('qna', views.qna, name='qna'),
    path('writepage', views.writepage, name='writepage'),
    path('posting/<int:pk>',views.posting, name='posting'),
]
