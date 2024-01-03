from django import forms
from django.forms import TextInput, EmailInput, NumberInput 
from .models import *
# from ckeditor_uploader.widgets import CKEditorUploadingWidget
class PostForm(forms.ModelForm):    
    class Meta:
        model = Board
        fields = ['postname', 'category', 'contents']
        widgets = {
            'postname': TextInput(
                attrs={
                    'class': 'form-control', 
                    'style': 'width: 300px;',
                    'placeholder': '제목을 입력하세요.',
                    }
            ),
        }
    
class PostUpdate(forms.ModelForm):
    class Meta:
        model = Board
        fields = ['postname', 'contents']

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['post', 'user']
             
