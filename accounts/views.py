import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import User as Custom_User
from .forms import CustomSocialSignupForm
from django.shortcuts import redirect
from django.contrib import messages
from allauth.socialaccount.views import SignupView as SocialSignupView
from django.shortcuts import redirect, render
from .forms import CustomSocialSignupForm  # Import your CustomSocialSignupForm here
from django.urls import reverse_lazy
from allauth.account.views import LoginView

class CustomLoginView(LoginView):
    success_url = reverse_lazy('main')
    def form_invalid(self, form):
        messages.error(self.request, '아이디 혹은 비밀번호가 틀렸습니다.')
        return super().form_invalid(form)
    
class CustomSocialSignupView(SocialSignupView):
    form_class = CustomSocialSignupForm
    
    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect("login/")  # Redirect to home or any other URL if the user is already authenticated
        return super().get(request, *args, **kwargs)

    def get_success_url(self):
        return reverse_lazy('login')
    
    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)
        if form.is_valid():
            # 폼이 유효하면 여기에 원하는 동작을 추가하세요
            # 예를 들어, 데이터를 저장하고 리다이렉션할 수 있습니다.
            print(form.cleaned_data)
            form.save(request)
            return redirect('login/')  # 여기에 여러분이 원하는 성공 URL을 넣어주세요
        else:
            # 폼이 유효하지 않을 때 필요한 작업을 추가하세요
            print(form.errors)
            return render(request, self.template_name, {'form': form})
        
@csrf_exempt  # 개발 단계에서만 사용. 실제 배포시 CSRF 토큰을 적절히 처리해야 합니다.
def check_username(request):
    # 클라이언트로부터 AJAX 요청을 통해 전달받은 username 값
    data = json.loads(request.body)
    username = data.get('username')

    # User 모델을 사용하여 해당 username이 이미 존재하는지 확인
    isDuplicate = Custom_User.objects.filter(username=username).exists()

    # is_taken 값을 JSON 형태로 클라이언트에 반환
    return JsonResponse({'isDuplicate': isDuplicate})

@csrf_exempt
def check_nickname(request):
    # 클라이언트로부터 AJAX 요청을 통해 전달받은 nickname 값
    data = json.loads(request.body)
    nickname = data.get('nickname')

    # User 모델을 사용하여 해당 nickname 이미 존재하는지 확인
    isDuplicate = Custom_User.objects.filter(nickname=nickname).exists()

    # is_taken 값을 JSON 형태로 클라이언트에 반환
    return JsonResponse({'isDuplicate': isDuplicate})

# 소셜 회원가입용 아이디 체크
@csrf_exempt  # 개발 단계에서만 사용. 실제 배포시 CSRF 토큰을 적절히 처리해야 합니다.
def social_check_username(request):
    # 클라이언트로부터 AJAX 요청을 통해 전달받은 username 값
    data = json.loads(request.body)
    username = data.get('username')

    # User 모델을 사용하여 해당 username이 이미 존재하는지 확인
    isDuplicate = Custom_User.objects.filter(username=username).exists()

    # is_taken 값을 JSON 형태로 클라이언트에 반환
    return JsonResponse({'isDuplicate': isDuplicate})