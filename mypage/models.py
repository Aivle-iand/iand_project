from django.db import models
from django.conf import settings

class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    image_url = models.URLField(max_length=500, blank=True)
    audio_url = models.URLField(max_length=500, blank=True)

    def __str__(self):
        return f"{self.user.username}'s profile"