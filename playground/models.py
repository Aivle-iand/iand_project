from django.db import models


class Book(models.Model):
    name = models.CharField(max_length=90)
    category = models.TextField(null=True, blank=True)
    card_image = models.ImageField(upload_to='books/')  # 'media/books/'에 이미지 저장
    profile_image = models.ImageField(null=True, blank=True, upload_to='profiles/') # 후처리
    prologue = models.TextField(null=True, blank=True) # 후처리
    year_of_life = models.TextField(null=True, blank=True)
    quiz = models.IntegerField(default=0) # 후처리

    def __str__(self):
        return self.name
    


# Episode table 추가
class Episode(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='episodes')
    title = models.CharField(max_length=200)
    content = models.TextField(null=True, blank=True)
    episode_number = models.PositiveIntegerField(default=1, help_text="에피소드 번호") #양수만 받는 필드
    book_image = models.ImageField(upload_to='contents/')  # Image for each episode

    def __str__(self):
        return f"{self.book.name} - {self.title}"
    
    
    '''
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='episodes')
    title = models.CharField(max_length=20)
    describe = models.TextField(null=True, blank=True)
    image = 
    voice = 
    voice_text = 
    episode_number =
    scene_number =
    quiz_text =
    quiz_answer =

  
    '''
