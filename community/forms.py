from django import forms
from .models import *
class PostForm(forms.Form):
    postname = forms.CharField(error_messages={'required': "제목을 입력해주세요."}, label='제목', max_length=64)
    contents = forms.CharField(error_messages={'required': "내용을 입력해주세요."}, label='내용', widget=forms.Textarea)
