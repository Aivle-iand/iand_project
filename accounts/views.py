import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import User as Custom_User
from allauth.socialaccount import views as social_view
from .forms import CustomSocialSignupForm
from django.shortcuts import redirect
from django.contrib import messages
from allauth.socialaccount.views import SignupView as SocialSignupView
from django.contrib import messages  # Import messages module
from django.shortcuts import redirect
from .forms import CustomSocialSignupForm  # Import your CustomSocialSignupForm here
from django.urls import reverse

class CustomSocialSignupView(SocialSignupView):
    form_class = CustomSocialSignupForm
    
    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect("login/")  # Redirect to home or any other URL if the user is already authenticated
        return super().get(request, *args, **kwargs)

    def get_success_url(self):
        messages.success(self.request, "회원가입이 성공적으로 이루어졌습니다!")  # Add a success message        
        return reverse('login')
    
@csrf_exempt  # 개발 단계에서만 사용. 실제 배포시 CSRF 토큰을 적절히 처리해야 합니다.
def check_username(request):
    # 클라이언트로부터 AJAX 요청을 통해 전달받은 username 값
    data = json.loads(request.body)
    username = data.get('username')

    # User 모델을 사용하여 해당 username이 이미 존재하는지 확인
    isDuplicate = Custom_User.objects.filter(username=username).exists()

    # is_taken 값을 JSON 형태로 클라이언트에 반환
    return JsonResponse({'isDuplicate': isDuplicate})

@csrf_exempt
def check_nickname(request):
    # 클라이언트로부터 AJAX 요청을 통해 전달받은 nickname 값
    data = json.loads(request.body)
    nickname = data.get('nickname')

    # User 모델을 사용하여 해당 nickname 이미 존재하는지 확인
    isDuplicate = Custom_User.objects.filter(nickname=nickname).exists()

    # is_taken 값을 JSON 형태로 클라이언트에 반환
    return JsonResponse({'isDuplicate': isDuplicate})

