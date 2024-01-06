from django.shortcuts import render
from django.http import JsonResponse
from .models import UserProfile
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
    return render(request, 'mypage/mypage_certify.html')

def mypage_temp(request):
    context = {
        'face' : "https://iand-bucket.s3.ap-northeast-2.amazonaws.com/media/common/noimage.jpg",
    }
    return render(request, 'mypage/mypage_temp.html', context)

region_name = env('S3_REGION_NAME')
access_key_id = env('S3_ACCESS_KEY_ID')
secret_access_key = env('S3_SECRET_ACCESS_KEY')
bucket_name = env('S3_BUCKET_NAME')
custom_domain = f'{bucket_name}.s3.{region_name}.amazonaws.com'

def upload_image(args):
    file = args['file']
    user = args['user']
    s3 = boto3.client('s3', aws_access_key_id=access_key_id, aws_secret_access_key=secret_access_key, region_name=region_name)
    # S3에 파일 업로드
    s3.upload_fileobj(file, bucket_name, f'media/{user}/profile/face_img.png', ExtraArgs={'ACL': 'public-read'})
    # S3 파일 URL 생성
    file_url = f'{custom_domain}/media/{user}/profile/face_img.png'
    # DB에 URL 저장
    profile = UserProfile.objects.filter(user=user).exists()
    if (profile):
        user_profile = UserProfile.objects.update(user=user, image_url=file_url)
    else:
        user_profile = UserProfile.objects.create(user=user, image_url=file_url)
    
    return user_profile
    
def upload_voice(args):
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
    print(response_json)
    try:
        voice_id = response_json['voice_id']
    except:
        return JsonResponse({'status': 'error', 'message': '보이스 아이디를 찾을 수 없습니다.'})
        
    profile = UserProfile.objects.filter(user=user).exists()
    if (profile):
        user_profile = UserProfile.objects.update(user=user, audio_url=voice_id)
    else:
        user_profile = UserProfile.objects.create(user=user, audio_url=voice_id)
        
    return user_profile

@csrf_exempt
def upload_media(request):
    func_tool = {
        'image': upload_image,
        'audio': upload_voice,
    }
    print(request.FILES.get('file'))
    param = {
        'file': request.FILES.get('file'),
        'user': request.user,
    }
    print(request.user.id)
    file_url = f'{custom_domain}/media/{request.user}/profile/face_img.png',
    key = param['file'].content_type.split('/')[0]
    is_success = func_tool[key](param)
    
    if is_success:
        return JsonResponse({'status': 'success', 'message': 'File uploaded successfully', 'file_url': file_url})
    elif not is_success:
        return JsonResponse({'status': 'error', 'message': 'Invalid request'})

    return JsonResponse({'status': 'error', 'message': 'Invalid request'})