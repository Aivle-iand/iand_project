from django import forms
from .models import *
class PostForm(forms.ModelForm):    
    class Meta:
        model = Board
        fields = ['postname', 'contents', 'category', 'writer']

class PostUpdate(forms.ModelForm):
    class Meta:
        model = Board
        fields = ['postname', 'contents']

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['post', 'user']
             
