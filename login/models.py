from django.db import models
from django.contrib.auth.models import AbstractBaseUser

class User(AbstractBaseUser):
    # Primary Key
    user_id = models.CharField(primary_key=True, max_length=50)
    
    # Required fields
    user_pw = models.CharField(max_length=16)
    username = models.CharField(max_length=50, null=False)
    nickname = models.CharField(max_length=50, null=False)
    
    # Additional fields
    premium_level = models.IntegerField(null=True)
    profile_img_path = models.CharField(max_length=100, null=True)
    character_composite_img_path = models.CharField(max_length=100, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    USERNAME_FIELD = 'user_id'
    
    def save(self, *args, **kwargs):
        self.set_password(self.user_pw) # Ensure the password is hashed before saving
        super(User, self).save(*args, **kwargs)

    def __str__(self):
        return self.username
