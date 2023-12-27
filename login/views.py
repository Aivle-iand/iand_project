from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import User
from django.contrib.auth.hashers import make_password, check_password
from django.contrib import messages, auth
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth.forms import AuthenticationForm
from django.urls import reverse

# Create your views here.
# views.py

def custom_signin_view(request):
    if request.method == 'POST':
        user_id = request.POST.get('user_id')
        user_pw = request.POST.get('user_pw')
        
        user = User.objects.get(user_id=user_id)
        
        user_pw = user.check_password(user_pw)
        user = auth.authenticate(request, username=user_id, password=user_pw)
        
        if user is not None:
            auth.login(request, user)
            return redirect("/")
        else:
            messages.error(request, '아이디(로그인 전용 아이디) 또는 비밀번호를 잘못 입력했습니다.')
            return redirect('/accounts')
    return render(request, "login.html")

def custom_signup_view(request):
    return render(request, "signup.html")

def signup(request):
    if request.method == 'POST':
        user_id = request.POST.get('user_id')
        user_pw = request.POST.get('user_pw')
        username = request.POST.get('username')
        nickname = request.POST.get('nickname')

        # 유저 생성 및 저장
        user = User()
        user.user_id = user_id
        user.user_pw = make_password(user_pw)
        user.username = username
        user.nickname = nickname
        user.save()

        messages.success(request, '회원가입이 성공적으로 이루어졌습니다!')
        return redirect('/accounts/')  # 성공 URL
    else:
        # GET 요청 시 회원가입 페이지 렌더링
        return render(request, 'signup.html')

from .models import User  # User 모델을 임포트

@csrf_exempt  # 개발 단계에서만 사용. 실제 배포시 CSRF 토큰을 적절히 처리해야 합니다.
def check_user_id(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_id = data.get("user_id")
        is_duplicate = User.objects.filter(user_id=user_id).exists()  # user_id 컬럼을 사용하여 중복 확인
        return JsonResponse({'isDuplicate': is_duplicate})

    return JsonResponse({'error': 'Invalid method'}, status=400)