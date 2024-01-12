import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import User as Custom_User
from .forms import CustomSocialSignupForm
from django.shortcuts import redirect
from django.contrib import messages
from allauth.socialaccount.views import SignupView as SocialSignupView
from django.shortcuts import redirect, render
from .forms import CustomSocialSignupForm
from django.urls import reverse_lazy
from allauth.account.views import LoginView
import requests

def get_client_ip(request):
    try:
        response = requests.get('https://ipinfo.io/json')
        data = response.json()
        ip = data.get('ip', '')
        country = data.get('country', '')
        return JsonResponse({'ip': ip, 'country': country})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

class CustomLoginView(LoginView):
    template_name = 'account/login.html'
    
class CustomSocialSignupView(SocialSignupView):
    form_class = CustomSocialSignupForm
    
    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect("login/")
        return super().get(request, *args, **kwargs)

    def get_success_url(self):
        return reverse_lazy('login')
    
    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)
        if form.is_valid():
            form.save(request)
            return redirect('login/')
        else:
            return render(request, self.template_name, {'form': form})
        
@csrf_exempt
def check_username(request):
    data = json.loads(request.body)
    username = data.get('username')

    isDuplicate = Custom_User.objects.filter(username=username).exists()

    return JsonResponse({'isDuplicate': isDuplicate})

@csrf_exempt
def check_nickname(request):
    data = json.loads(request.body)
    nickname = data.get('nickname')

    isDuplicate = Custom_User.objects.filter(nickname=nickname).exists()

    return JsonResponse({'isDuplicate': isDuplicate})

@csrf_exempt 
def social_check_username(request):
    data = json.loads(request.body)
    username = data.get('username')

    isDuplicate = Custom_User.objects.filter(username=username).exists()

    return JsonResponse({'isDuplicate': isDuplicate})

@csrf_exempt
def social_check_nickname(request):
    data = json.loads(request.body)
    nickname = data.get('nickname')

    isDuplicate = Custom_User.objects.filter(nickname=nickname).exists()

    return JsonResponse({'isDuplicate': isDuplicate})