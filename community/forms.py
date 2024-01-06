from django import forms
from django.forms import TextInput, EmailInput, NumberInput, Select
from .models import *
# from ckeditor_uploader.widgets import CKEditorUploadingWidget
class PostForm(forms.ModelForm):
    class Meta:
        model = Board
        fields = ['postname', 'category', 'contents']
        widgets = {
            'postname': TextInput(
                attrs={
                    'class': 'form_control', 
                    'style': 'width: 300px; margin-bottom: 10px; dispalt',
                    'placeholder': '제목을 입력하세요.',
                    }),
            
                'category': Select(
                    attrs={'class':'select_category_box',
                           }),
        }
    
class PostUpdate(forms.ModelForm):
    class Meta:
        model = Board
        fields = ['postname', 'contents']
        widgets = {
            'postname': TextInput(
                attrs={
                    'class': 'form_control', 
                    'style': 'width: 300px; margin-bottom: 10px; dispalt',
                    }),
            
                'category': Select(
                    attrs={'class':'select_category_box',
                           }),
        }

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['content']
        exclude = ('post', 'writer')
        widgets = {
            'content':TextInput(
                attrs={
                    'placeholder':'댓글을 입력하세요.',
                    'style':'width:100%; resize:none; height:100px; border:none;'
                }
            )
        }
