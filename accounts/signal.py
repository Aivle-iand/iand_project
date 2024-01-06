from allauth.account.signals import user_signed_up, user_logged_in
from django.dispatch import receiver
from .models import LoginHistory
from django.utils import timezone
import requests
from django.contrib.auth.hashers import make_password

@receiver(user_signed_up)
def populate_profile(request, user, **kwargs):
    user.first_name = request.POST.get('first_name', '')
    user.last_name = request.POST.get('last_name', '')
    user.nickname = request.POST.get('nickname', '')
    pin_number = request.POST.get('pin_number', '')
    user.pin_number = make_password(pin_number)
    user.save()

@receiver(user_logged_in)
def log_user_login2(sender, request, user, **kwargs):
    try:
        response = requests.get('https://ipinfo.io/json')
        data = response.json()
        ip = data.get('ip', '')
        country = data.get('country', '')
        LoginHistory.objects.create(user=user, username=user.username, timestamp=timezone.now(), ip=ip, country=country)
    except Exception as e:
        print(f"Error fetching IP info: {e}")