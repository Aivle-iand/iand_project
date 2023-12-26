from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='books/')  # 'media/books/'에 이미지 저장
    quiz = models.IntegerField(default=0)

    def __str__(self):
        return self.title

