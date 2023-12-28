from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'mypage/mypage_certify.html')

def mypage_temp(request):
    return render(request, 'mypage/mypage_temp.html') 