from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    nickname = models.CharField(max_length=50)
    premium_level = models.IntegerField(null=True)
    profile_img_path = models.CharField(max_length=100, null=True)
    character_composite_img_path = models.CharField(max_length=100, null=True)