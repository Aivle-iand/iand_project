from allauth.account.signals import user_signed_up, user_logged_in
from django.dispatch import receiver
from .models import LoginHistory
from django.utils import timezone

@receiver(user_signed_up)
def populate_profile(request, user, **kwargs):
    user.first_name = request.POST.get('first_name', '')
    user.last_name = request.POST.get('last_name', '')
    user.nickname = request.POST.get('nickname', '')
    user.nickname = request.POST.get('id_nickname', '')
    user.save()

@receiver(user_logged_in)
def log_user_login(sender, request, user, **kwargs):
    LoginHistory.objects.create(user=user, username=user.username, timestamp=timezone.now())