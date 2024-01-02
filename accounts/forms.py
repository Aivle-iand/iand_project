from django import forms
from .models import User
from allauth.socialaccount.forms import SignupForm as SocialSignup


class CustomSocialSignupForm(SocialSignup):
    last_name = forms.CharField(required=False)
    first_name = forms.CharField(required=False)
    nickname = forms.CharField(required=False)
 
    def __init__(self, *args, **kwargs):
        super(CustomSocialSignupForm, self).__init__(*args, **kwargs)
        self.fields['nickname'].label = '닉네임'
        self.fields['last_name'].label = '성'
        self.fields['first_name'].label = '이름'
        
        self.fields['username'].widget = forms.HiddenInput()
        self.fields['email'].widget = forms.HiddenInput()
    def save(self, request):
        # user.additional_field = self.cleaned_data['additional_field']
        user = super(CustomSocialSignupForm, self).save(request)
        return user    
    
    # def save(self, request):
    #     user = super(CustomSocialSignupForm, self).save(request)
    #     user.first_name = self.cleaned_data.get('first_name')
    #     user.last_name = self.cleaned_data.get('last_name')
    #     user.nickname = self.cleaned_data.get('nickname')
    #     user.save()
    #     return user



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
    
