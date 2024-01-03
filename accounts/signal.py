from allauth.account.signals import user_signed_up
from django.dispatch import receiver
from django.contrib import messages
from django.contrib.auth.models import User  # Django의 기본 User 모델을 사용

@receiver(user_signed_up)
def populate_profile(request, user, **kwargs):
    user.first_name = request.POST.get('first_name', '')
    user.last_name = request.POST.get('last_name', '')
    user.nickname = request.POST.get('nickname', '')
    user.save()
    