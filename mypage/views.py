from django.shortcuts import render, redirect
from accounts.models import User as Custom_User
from accounts.models import LoginHistory
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password
import json



# Create your views here.
def index(request):
    if not request.user.is_authenticated:
        return redirect('accounts/login')
    username = request.user
    str_username = str(username)
    marked_id = str_username[:2] + '*' * 5 + str_username[-2:]
    context = {
        'marked_id' : marked_id,
    }
    return render(request, 'mypage/mypage_certify.html', context)

def mypage_temp(request):
    # pin_chk = request.session['pin_checked']
    if not request.user.is_authenticated:
        return redirect('accounts/login')
    # if pin_chk == None:
    #     return redirect('mypage')
    history = {}
    username = request.user
    login_histories = LoginHistory.objects.filter(username = username)
    for i in range(len(login_histories)):
            login_time = str(login_histories[i].timestamp)
            login_id = login_histories[i].username
            marked_id = login_id[:2] + '*' * (len(login_id) - 4) + login_id[-2:]
            history[i] = {'date' : login_time[:-7], 'login_id' : marked_id, 'country' : login_histories[i].country, 'ip' : login_histories[i].ip}
    context = {
        'face' : "https://iand-bucket.s3.ap-northeast-2.amazonaws.com/media/common/noimage.jpg",
        'login_history' : history,
    }
    return render(request, 'mypage/mypage_temp.html', context) 

@csrf_exempt
def check_api_user(request):
    username = request.user
    user = Custom_User.objects.get(username = username)
    if(user.email == ''):
        api_user = False
    else:
        api_user = True
    return JsonResponse({'api_user' : api_user})
        
@csrf_exempt
def check_nickname(request):
    nickname = request.GET.get('personal_nickname', '')
    is_taken = Custom_User.objects.filter(nickname=nickname).exists()
    return JsonResponse({'is_taken': is_taken})

@require_POST
@csrf_exempt
def check_current_password(request):
    data = json.loads(request.body)
    current_password = data.get('cur_password', '')
    user = request.user    
    if user and check_password(current_password, user.password):
        return JsonResponse({'match': True})
    else:
        return JsonResponse({'match': False})
    
@csrf_exempt
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
    
@csrf_exempt
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
          
@csrf_exempt
def delete_account(request):
    if request.method == 'POST':
        user = request.user
        user.delete()  # 현재 로그인된 사용자 삭제
        return JsonResponse({'message': '계정이 성공적으로 삭제되었습니다. 로그인 페이지로 이동합니다.'})
    else:
        return JsonResponse({'status': 'error'})
        
@csrf_exempt
def check_pin_pwd(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        cur_pinpwd = data.get('cur_pinpwd', '')
        username = request.user
        if username and check_password(cur_pinpwd, username.pin_number):
            # request.session['pin_checked'] = True
            return JsonResponse({'match' : True})
        else:
            return JsonResponse({'match' : False})
    else:
        return JsonResponse({'status' : 'error'})
        