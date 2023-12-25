from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'mypage/mypage_certify.html')

def mypage_temp(request):
    return render(request, 'mypage/mypage_temp.html')

def upload_img(request):
    return render(request, 'mypage/face_register.html')

def upload_voice(request):
    return render(request, 'mypage/voice_register.html')    