from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import User
from django.contrib.auth.hashers import make_password

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
            return render(request, 'signup.html', {'error': '이미 사용중인 아이디입니다.'})

        # 유저 생성 및 저장
        user = User()
        user.user_id = user_id
        user.user_pw = make_password(user_pw)
        user.username = username
        user.nickname = nickname
        user.save()

        # 성공 시 로그인 페이지 또는 다른 페이지로 리다이렉트
        return redirect('/login/')  # 성공 시 리다이렉트 될 경로 지정
    else:
        # GET 요청 시 회원가입 페이지 렌더링
        return render(request, 'signup.html')
