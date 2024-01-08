from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import UserProfile
from accounts.models import User as Custom_User
from accounts.models import LoginHistory
from django.views.decorators.http import require_POST
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import os
import boto3
import environ
import requests
import base64
import json

env = environ.Env(
    DEBUG=(bool, False)
)

environ.Env.read_env(
    env_file=os.path.join(settings.BASE_DIR, 'secrets.config')
)

# Create your views here.
def index(request):
    if not request.user.is_authenticated:
        return redirect('accounts/login')
    
    try:
        pin_chk = request.session['pin_checked']
        if (pin_chk):
            return redirect('/mypage/mypage_temp')
    except:
        request.session['pin_checked'] = False
    finally:
        username = request.user
        str_username = str(username)
        marked_id = str_username[:2] + '*' * 5 + str_username[-2:]
        context = {
            'marked_id' : marked_id,
        }
        
        return render(request, 'mypage/mypage_certify.html', context)

def mypage_temp(request):
    if not request.user.is_authenticated:
        return redirect('accounts/login')
    
    try:
        _ = request.session['pin_checked']
    except:
        return redirect('/mypage')
    finally:
        history = {}
        username = request.user
        profile = UserProfile.objects.filter(user_id = username).first()
        login_histories = LoginHistory.objects.filter(username = username)
        for i in range(len(login_histories)):
                login_time = str(login_histories[i].timestamp)
                login_id = login_histories[i].username
                marked_id = login_id[:2] + '*' * (len(login_id) - 4) + login_id[-2:]
                history[i] = {'date' : login_time[:-7], 'login_id' : marked_id, 'country' : login_histories[i].country, 'ip' : login_histories[i].ip}
        context = {
            'login_history' : history,
        }
        
        if profile and profile.image_url:
            context['profile_img'] = profile.image_url
        else: 
            context['profile_img'] = None
        
        return render(request, 'mypage/mypage_temp.html', context)

region_name = env('S3_REGION_NAME')
access_key_id = env('S3_ACCESS_KEY_ID')
secret_access_key = env('S3_SECRET_ACCESS_KEY')
bucket_name = env('S3_BUCKET_NAME')
custom_domain = f'{bucket_name}.s3.{region_name}.amazonaws.com'

def upload_image(args):
    is_success = False
    file, type, user = args.values()

    s3 = boto3.client('s3', aws_access_key_id=access_key_id, aws_secret_access_key=secret_access_key, region_name=region_name)
    # S3에 파일 업로드
    s3.upload_fileobj(
        Fileobj=file,
        Bucket=bucket_name, 
        Key=f'media/{user}/profile/face_img.png', 
        ExtraArgs={
            'ACL': 'public-read',
            'ContentType': type,  # 예시로 JPEG 이미지 설정
            'ContentDisposition': 'inline'  # 브라우저에서 바로 표시
            })
    # S3 파일 URL 생성
    file_url = f'{custom_domain}/media/{user}/profile/face_img.png'
    
    # DB에 URL 저장
    user_profile = UserProfile.objects.filter(user_id=user)
    if (bool(user_profile)):
        try:
            user_profile.update(image_url=file_url)
            is_success = True
        except:
            is_success = False
    else:
        try:
            user_profile = UserProfile.objects.create(user=user, image_url=file_url)   
            is_success = True
        except:
            is_success = False
    
    return is_success
    
def upload_voice(args):
    is_success = False
    file = args['file']
    user = args['user']

    user_bytes = user.username.encode("ascii") 
    user_encode = base64.b64encode(user_bytes) 
    
    file_path = f'./mypage/{file.name}'
    with open(file_path, 'wb+') as destination:
        for chunk in file.chunks():
            destination.write(chunk)
        
    with open(file_path, 'rb') as f:
        files = {'files': (file.name, f), 'name': (None, user_encode)}
        headers = {'xi-api-key': env('XI_API_KEY')}
        response = requests.post('https://api.elevenlabs.io/v1/voices/add',
                                  headers=headers,
                                  files=files,)
    os.remove(file_path)
    response_json = json.loads(response.text)
    
    try:
        voice_id = response_json['voice_id']
    except:
        return is_success 
        
    user_profile = UserProfile.objects.filter(user_id=user)
    if (bool(user_profile)):
        try:
            user_profile.update(audio_url=voice_id)
            is_success = True
        except:
            is_success = False
    else:
        try:
            user_profile = UserProfile.objects.create(user=user, audio_url=voice_id)   
            is_success = True
        except:
            is_success = False

    return is_success

@csrf_exempt
def upload_media(request):
    func_tool = {
        'image': upload_image,
        'audio': upload_voice,
    }
    
    param = {
        'file': request.FILES['file'],
        'type': request.FILES['file'].content_type,
        'user': request.user,
    }
    print(request.FILES['file'])
    file_url = f'{custom_domain}/media/{request.user}/profile/face_img.png',
    key = param['type'].split('/')[0]
    is_success = func_tool[key](param)
    
    if is_success:
        return JsonResponse({'status': 'success', 'message': 'File uploaded successfully', 'file_url': file_url})
    elif not is_success:
        return JsonResponse({'status': 'error', 'message': 'Invalid request'})


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
            request.session['pin_checked'] = True
            return JsonResponse({'match' : True})
        else:
            return JsonResponse({'match' : False})
    else:
        return JsonResponse({'status' : 'error'})
        
