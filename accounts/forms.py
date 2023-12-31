from django import forms
from .models import User
from allauth.account.forms import SignupForm
from allauth.socialaccount.forms import SignupForm as SocialSignup

class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'nickname', 'premium_level', 'profile_img_path', 'character_composite_img_path',]

    def __init__(self, *args, **kwargs):
        super(UserForm, self).__init__(*args, **kwargs)
        for field in self.fields:
            self.fields[field].required = False
            
# class CustomSignupForm(SignupForm):
#     first_name = forms.CharField(required=False)
#     last_name = forms.CharField(required=False)
#     nickname = forms.CharField(required=False)
    
#     def save(self, request):
#         user = super(CustomSignupForm, self).save(request)
#         return user
    
class CustomSocialSignupForm(SocialSignup):
    first_name = forms.CharField(required=False)
    last_name = forms.CharField(required=False)
    nickname = forms.CharField(required=False)
    
    def save(self, request):
        user = super(CustomSocialSignupForm, self).save(request)
        return user
