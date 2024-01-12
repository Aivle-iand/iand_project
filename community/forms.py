from django import forms
from django.forms import TextInput, EmailInput, NumberInput, Select
from .models import *

class PostForm(forms.ModelForm):
    class Meta:
        model = Board
        fields = ['postname', 'category', 'contents']
        widgets = {
            'postname': TextInput(
                attrs={
                    'class': 'form_control',
                    'style': 'width: 300px; margin-bottom: 10px;',
                    }),
           
            'category': Select(
                attrs={'class':'select_category_box',
                        }),
           
            'contents' : forms.Textarea(
                attrs = {
                    'placeholder' : "본문 내용을 입력하세요. ",
                    'style' : 'font-size : 18px;',
                }
            )
        }
        labels = {
            'postname': '제목',
            'category': '카테고리',
            'contents': '내용',
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
        labels = {
            'postname': '제목',
            'contents': '내용',
        }
 
class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['content']
        exclude = ('post', 'writer')
        widgets = {
            'content':forms.Textarea(
                attrs={
                    'placeholder':'댓글을 입력하세요.',
                    'style':'width:100%; resize:none; height:100px; border:none;'
                }
            )
        }