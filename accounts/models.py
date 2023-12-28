from django.db import models
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    
    # username = models.CharField(max_length=50, unique=True) # 이름
    nickname = models.CharField(max_length=50)
    
    # Primary Key
    user_id = models.CharField(primary_key=True, max_length=50)
    
    # Required fields
    # password = models.CharField(max_length=128)  # Updated max_length for hashed passwords
    # last_login = models.DateTimeField(auto_now=True)
    # is_supersuer = models.BooleanField(null=True)
    # username = models.CharField(max_length=150, unique=True) 
    # first_name = models.CharField(max_length=150, null=True) 
    # last_name = models.CharField(max_length=150, null=True) 
    # email = models.CharField(max_length=254, null=True) 
    # is_staff = models.BooleanField(null=True) 
    # is_active = models.BooleanField(null=True) 
    # date_joined = models.DateTimeField(auto_now_add=True, null=True)
    
    # Additional fields
    premium_level = models.IntegerField(null=True)
    profile_img_path = models.CharField(max_length=100, null=True)
    character_composite_img_path = models.CharField(max_length=100, null=True)
    # created_at = models.DateTimeField(auto_now_add=True)

    def set_password(self, raw_password):
        return make_password(raw_password)

    # def save(self, *args, **kwargs):
    #     # Call set_password here if you want to ensure the password is always hashed before saving
    #     # Or you could call set_password method explicitly before saving the user instance elsewhere in your code
    #     self.set_password(self.user_pw)
    #     super().save(*args, **kwargs)

    def __str__(self):
        return self.username
