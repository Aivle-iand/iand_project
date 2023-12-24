from django.shortcuts import render, redirect
from django.urls import path
from .forms import PostForm
from .models import *
from django.http import HttpResponse


def writepage(request):
    # if not request.session.get('user'):
    #     return redirect('../login')
    if request.method == 'GET':
        form = PostForm()
        
    elif request.method == 'POST':
        form = PostForm(request.POST)
        if form.is_valid():
            # user_id = request.session.get('user')
            # user = Users.objects.get(pk=user_id)
            
            new_article=Board(
                postname = form.cleaned_data['postname'],
                contents = form.cleaned_data['contents'],
                # writer = user
            )
        new_article.save()
        
        return redirect(f'community:posting', new_article.id)
    return render(request, 'writepage.html')

# Create your views here.
def announcement(request):
    post_list = Board.objects.all()
    return render(request, 'announcement.html', {'post_all':post_list})

def freeboard(request):
    post_list = Board.objects.all().order_by('-id')
    return render(request, 'freeboard.html', {'post_all':post_list})

def qna(request):
    post_list = Board.objects.all()
    return render(request, 'qna.html', {'post_all':post_list})

def posting(request, pk):
    # 게시글(Post) 중 pk(primary_key)를 이용해 하나의 게시글(post)를 검색
    post = Board.objects.get(id=pk)
    # posting.html 페이지를 열 때, 찾아낸 게시글(post)을 post라는 이름으로 가져옴
    return render(request, 'posting.html', {'posting':post})