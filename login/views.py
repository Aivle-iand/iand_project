from django.shortcuts import render
from django.http import HttpResponse
from .models import User
from django.contrib.auth.hashers import make_password  # make_password를 import합니다.

from django.shortcuts import render, redirect

# Create your views here.
# views.py

def custom_signin_view(request):
    return render(request, "login.html")

def custom_signup_view(request):
    return render(request, "signup.html")

def signup(request):
    if request.method == 'POST':
        # 데이터 추출
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

        # 성공 시 로그인 페이지 또는 다른 페이지로 리다이렉트
        return redirect('')
    else:
        # GET 요청 시 회원가입 페이지 렌더링
        return render(request, 'signup.html')

