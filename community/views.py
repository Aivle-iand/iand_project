from django.shortcuts import render, redirect, get_object_or_404
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
        # if form.is_valid():
        user_id = request.session.get('login_user')
            # user = Users.objects.get(pk=user_id)
            
        new_article=Board(
                postname = request.POST['postname'],
                contents = request.POST['contents'],
                # writer = user
            )
        new_article.save()
        
        return redirect(f'community:posting', new_article.id)
    return render(request, 'writepage.html')

# Create your views here.
def announcement(request):
    ann_list = BoardAnn.objects.all().order_by('-id')
    return render(request, 'announcement.html', {'post_all':ann_list})

def freeboard(request):
    free_list = BoardFree.objects.all().order_by('-id')
    return render(request, 'freeboard.html', {'post_all':free_list})

def qna(request):
    qna_list = BoardQna.objects.all().order_by('-id')
    return render(request, 'qna.html', {'post_all':qna_list})

def posting_ann(request, pk):
    # 게시글(Post) 중 pk(primary_key)를 이용해 하나의 게시글(post)를 검색
    post = BoardAnn.objects.get(id=pk)
    # posting.html 페이지를 열 때, 찾아낸 게시글(post)을 post라는 이름으로 가져옴
    return render(request, 'posting.html', {'posting':post})

def posting_free(request, pk):
    # 게시글(Post) 중 pk(primary_key)를 이용해 하나의 게시글(post)를 검색
    post = BoardFree.objects.get(id=pk)
    # posting.html 페이지를 열 때, 찾아낸 게시글(post)을 post라는 이름으로 가져옴
    return render(request, 'posting.html', {'posting':post})

def posting_qna(request, pk):
    # 게시글(Post) 중 pk(primary_key)를 이용해 하나의 게시글(post)를 검색
    post = BoardQna.objects.get(id=pk)
    # posting.html 페이지를 열 때, 찾아낸 게시글(post)을 post라는 이름으로 가져옴
    return render(request, 'posting.html', {'posting':post})