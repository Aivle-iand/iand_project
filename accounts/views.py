from django.shortcuts import render, redirect
from .models import User as Custom_User
from django.contrib.auth.hashers import check_password
from django.contrib import messages, auth
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

def custom_signin_view(request):
    if request.method == 'POST':
        success = True
        input_id = request.POST.get('usernameInput')
        input_pw = request.POST.get('passwordInput')
        
        is_success_login = check_password(input_pw, Custom_User.objects.filter(user_id=input_id).values('password').first()['password'])
        if is_success_login:
            found_user = Custom_User.objects.filter(user_id=input_id)[0]
            found_user_db = {'user': found_user.__dict__}
            found_user_db['user']['is_authenticated'] = True
            return render(request, 'main.html', context=found_user_db)
        
        else:
            messages.error(request, '아이디 또는 비밀번호가 일치하지 않습니다.')
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
        custom_user = Custom_User()
        custom_user.user_id = user_id
        custom_user.password = custom_user.set_password(user_pw)
        custom_user.username = username
        custom_user.nickname = nickname
        custom_user.save()

        messages.success(request, '회원가입이 성공적으로 이루어졌습니다!')
        return redirect('/accounts/')  # 성공 URL
    else:
        # GET 요청 시 회원가입 페이지 렌더링
        return render(request, 'signup.html')

@csrf_exempt  # 개발 단계에서만 사용. 실제 배포시 CSRF 토큰을 적절히 처리해야 합니다.
def check_user_id(request):
    # 클라이언트로부터 AJAX 요청을 통해 전달받은 user_id 값
    data = json.loads(request.body)
    user_id = data.get('user_id')

    # User 모델을 사용하여 해당 user_id가 이미 존재하는지 확인
    isDuplicate = Custom_User.objects.filter(user_id=user_id).exists()

    # is_taken 값을 JSON 형태로 클라이언트에 반환
    return JsonResponse({'isDuplicate': isDuplicate})

@csrf_exempt
def check_nickname(request):
    # 클라이언트로부터 AJAX 요청을 통해 전달받은 user_id 값
    data = json.loads(request.body)
    nickname = data.get('nickname')

    # User 모델을 사용하여 해당 nickname 이미 존재하는지 확인
    isDuplicate = Custom_User.objects.filter(nickname=nickname).exists()

    # is_taken 값을 JSON 형태로 클라이언트에 반환
    return JsonResponse({'isDuplicate': isDuplicate})

