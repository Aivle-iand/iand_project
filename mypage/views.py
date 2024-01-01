from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'mypage/mypage_certify.html')

def mypage_temp(request):
    context = {
        'face' : "https://iand-bucket.s3.ap-northeast-2.amazonaws.com/media/common/noimage.jpg",
    }
    return render(request, 'mypage/mypage_temp.html', context) 