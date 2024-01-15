from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = models.CharField(max_length=100, null=True)
    nickname = models.CharField(max_length=50)
    premium_level = models.IntegerField(null=True)
    profile_img_path = models.CharField(max_length=100, null=True)
    character_composite_img_path = models.CharField(max_length=100, null=True)
    pin_number = models.CharField(max_length=100, default='default-key')
    
class LoginHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    username = models.CharField(max_length=150)
    ip = models.CharField(max_length=20, default='')
    country = models.CharField(max_length=20, default='')