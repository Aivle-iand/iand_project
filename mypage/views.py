from django.shortcuts import render, redirect
from accounts.models import User as Custom_User
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password
import json



# Create your views here.
def index(request):
    return render(request, 'mypage/mypage_certify.html')

def mypage_temp(request):
    if not request.user.is_authenticated:
        return redirect('accounts/login')
    context = {
        'face' : "https://iand-bucket.s3.ap-northeast-2.amazonaws.com/media/common/noimage.jpg",
    }
    return render(request, 'mypage/mypage_temp.html', context) 

def check_nickname(request):
    nickname = request.GET.get('personal_nickname', '')
    is_taken = Custom_User.objects.filter(nickname=nickname).exists()
    return JsonResponse({'is_taken': is_taken})

@require_POST
def check_current_password(request):
    data = json.loads(request.body)
    current_password = data.get('cur_password', '')
    user = request.user
    if user and check_password(current_password, user.password):
        return JsonResponse({'match': True})
    else:
        return JsonResponse({'match': False})
    
def change_nickname(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        new_nickname = data.get('new_nickname')
        username = request.user
        user = Custom_User.objects.get(username = username)
        user.nickname = new_nickname
        user.save()
        return JsonResponse({'message' : '성공적으로 닉네임 변경을 완료하였습니다.'})
    else:
        return JsonResponse({ 'status' : 'error'})
    
def change_password(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        new_password = data.get('cur_password')
        username = request.user
        user = Custom_User.objects.get(username = username)
        user.password = make_password(new_password)
        user.save()
        return JsonResponse({'message' : '성공적으로 패스워드를 변경하였습니다. 다시 로그인 해주세요.'})
    else:
        return JsonResponse({ 'status' : 'error'})
          
def delete_account(request):
    if request.method == 'POST':
        user = request.user
        user.delete()  # 현재 로그인된 사용자 삭제
        return JsonResponse({'message': '계정이 성공적으로 삭제되었습니다. 로그인 페이지로 이동합니다.'})
        