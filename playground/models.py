from django.db import models
from django.conf import settings
from django.db import models

class Book(models.Model):
    name = models.CharField(max_length=90)
    category = models.TextField(null=True, blank=True)
    card_image = models.ImageField(upload_to='books/')  # 'media/books/'에 이미지 저장
    Ep_title_1 = models.CharField(max_length=30 , default=None, help_text="에피소드1")
    Ep_title_2 = models.CharField(max_length=30 , default=None, help_text="에피소드2")
    Ep_title_3 = models.CharField(max_length=30 , default=None, help_text="에피소드3")
    profile_image = models.ImageField(null=True, blank=True, upload_to='profiles/')
    prologue = models.TextField(null=True, blank=True)
    year_of_life = models.TextField(null=True, blank=True)
    lock = models.IntegerField(default=0)

    def __str__(self):
        return self.name
    
class Episodes(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='episodes')
    episode_number = models.PositiveIntegerField(default=1, help_text="에피소드 번호")
    scene_number = models.PositiveIntegerField(default=1, help_text="장면 번호")
    image = models.ImageField(upload_to='contents/', default=None, help_text="에피소드 장면 이미지")
    voice = models.FileField(upload_to='voices/',default=None, help_text="기본음성")
    voice_text = models.CharField(max_length=100,default=None, help_text="음성 대사 텍스트")
    image_segment = models.ImageField(upload_to='contents/', default=None, help_text="인물 테두리 이미지")
    x_index = models.IntegerField(default=0, help_text="css right 에 들어갈 x 값")
    y_index = models.IntegerField(default=0,help_text="css top 에 들어갈 y 값")
    height = models.IntegerField(default=0, help_text="css height에 들어갈 높이값")
    width = models.IntegerField(default=0, help_text="css width에 들어갈 넓이값")
    
        
    def __str__(self):
        return f"{self.book.name}_{self.episode_number}_{self.scene_number}"

#퀴즈 모델
class Quiz(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='quizzes')
    quiz_index = models.IntegerField(default=None)
    quiz_text = models.CharField(max_length=1000,default=None, help_text="퀴즈 문제 내용")
    quiz_answer =models.CharField(max_length=100,default=None, help_text="퀴즈 문제 정답")


class QuizHistory(models.Model):
    correct_users = models.ManyToManyField(
        settings.AUTH_USER_MODEL, 
        blank=True, 
        help_text="정답을 맞힌 사용자"
    )
    read_book = models.ManyToManyField(
        Book, 
        blank=True, 
        help_text="읽은 책"
    )
