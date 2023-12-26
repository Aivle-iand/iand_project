from django.db import models


class Book(models.Model):
    name = models.CharField(max_length=90)
    category = models.TextField(null=True, blank=True)
    card_image = models.ImageField(upload_to='books/')  # 'media/books/'에 이미지 저장
    profile_image = models.ImageField(null=True, blank=True, upload_to='profiles/')
    prologue = models.TextField(null=True, blank=True)
    year_of_life = models.TextField(null=True, blank=True)
    quiz = models.IntegerField(default=0)

    def __str__(self):
        return self.name