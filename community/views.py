from django.shortcuts import render, redirect, get_object_or_404
from django.urls import path
from .forms import PostForm
from .models import *
from django.http import HttpResponse
from django.views.generic import ListView, DetailView

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
        
        return redirect(f'community:detail', new_article.id)
    return render(request, 'community/writepage.html')
    
def categoryView(request, c_slug=None):
    c_page = None
    post_list = None
    # c_slug = Category.slug
    if c_slug != None:
        c_page = get_object_or_404(Category, slug=c_slug)
        post_list = Board.objects.filter(category=c_page)
    else:
        post_list = Board.objects.all()
    return render(request, 'community/category.html', {'category':c_page, 'post_list':post_list})

def detail(request, id):
    # 게시글(Post) 중 pk(primary_key)를 이용해 하나의 게시글(post)를 검색
    detail = Board.objects.get(id=id)
    return render(request, 'community/detail.html', {'detail':detail})