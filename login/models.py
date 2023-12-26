from django.db import models
from django.contrib.auth.hashers import make_password

class User(models.Model):
    # Primary Key
    user_id = models.CharField(primary_key=True, max_length=50)
    
    # Required fields
    user_pw = models.CharField(max_length=128)  # Updated max_length for hashed passwords
    username = models.CharField(max_length=50)
    nickname = models.CharField(max_length=50)
    
    # Additional fields
    premium_level = models.IntegerField(null=True)
    profile_img_path = models.CharField(max_length=100, null=True)
    character_composite_img_path = models.CharField(max_length=100, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def set_password(self, raw_password):
        self.user_pw = make_password(raw_password)

    def save(self, *args, **kwargs):
        # Call set_password here if you want to ensure the password is always hashed before saving
        # Or you could call set_password method explicitly before saving the user instance elsewhere in your code
        self.set_password(self.user_pw)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username
