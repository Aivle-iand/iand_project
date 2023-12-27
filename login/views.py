from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import User
from django.contrib.auth.hashers import make_password
from django.contrib import messages

# Create your views here.
# views.py

def custom_signin_view(request):
    return render(request, "login.html")

def custom_signup_view(request):
    return render(request, "signup.html")

def signup(request):
    if request.method == 'POST':
        user_id = request.POST.get('user_id')
        user_pw = request.POST.get('user_pw')
        username = request.POST.get('username')
        nickname = request.POST.get('nickname')

        # 아이디 중복 체크
        if User.objects.filter(user_id=user_id).exists():
            # 여기에 아이디 중복 시 처리 로직을 추가하세요.
            # 예: 중복 메시지를 사용자에게 표시
            messages.error(request, '회원가입에 실패했습니다!')
            return redirect('/accounts/signup')

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
