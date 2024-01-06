from django.urls import path
from . import views


urlpatterns = [
    path('', views.index, name='index'),
    path('score-quiz/<int:book_id>/', views.score_quiz, name='score_quiz'),
    path('voice_face_change/<int:checked_card>/', views.voice_face_change, name='voice_face_change'),
] 
