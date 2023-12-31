from allauth.account.signals import user_signed_up
from django.dispatch import receiver
from django.contrib import messages
from django.contrib.auth.models import User  # Django의 기본 User 모델을 사용

@receiver(user_signed_up)
def populate_profile(request, sociallogin=None, **kwargs):
    user = kwargs['user']  # kwargs에서 직접 user를 가져옴

    # 소셜 로그인이 아닌 경우에만 추가 정보를 가져오도록 조건을 추가
    if not sociallogin:
        # 예시: request.POST에서 직접 데이터 가져오기
        user.first_name = request.POST.get('first_name', '')
        user.last_name = request.POST.get('last_name', '')
        user.nickname = request.POST.get('nickname', '')
        user.save()

        messages.success(request, '회원가입이 성공적으로 이루어졌습니다!')
