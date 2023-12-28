from django.shortcuts import render, redirect, get_object_or_404
from django.urls import path
from .forms import PostForm
from .models import *
from django.http import HttpResponse
from django.views.generic import ListView, DetailView
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from login.models import User

def writepage(request):
    # if not request.session.get('user'):
    #     return redirect('../login')
    if request.method == 'POST':
        form = PostForm(request.POST)
        # if form.is_valid():
            # user_id = request.session.get('login_user')
            # user = User.objects.get(pk=user_id)
        new_article=Board.objects.create(
            postname=request.POST['postname'],
            contents=request.POST['contents'],
            )
        new_article=Board.objects.create(
                postname=request.POST['postname'],
                contents=request.POST['contents'],
            )
        return redirect('/comunity/')
    return render(request, 'community/writepage.html')
    
def categoryView(request, c_slug=None):
    c_page = None
    keyword, search_field = request.GET.get('keyword', ''), request.GET.get('search_field', '0')
    
    if c_slug != None:
        c_page = get_object_or_404(Category, slug=c_slug)
        post_list = Board.objects.filter(category=c_page).order_by('-id')
    else:
        post_list = Board.objects.all().order_by('-id')
    
    if search_field == '0':
        post_list = post_list.filter(postname__icontains = keyword)
    else:
        pass
        #page_obj = page_obj.filter(writer__icontains = keyword)
        
    page = request.GET.get('page')
    paginator = Paginator(post_list, 2)
    try:
        page_obj = paginator.page(page)
    except PageNotAnInteger:
        page = 1
        page_obj = paginator.page(page)
    except EmptyPage:
        page = paginator.num_pages
        page_obj = paginator.page(page)
        
    leftindex = (int(page) - 2)
    if leftindex < 1:
        leftindex = 1
    
    rightindex = (int(page) + 2)
    
    if rightindex < paginator.num_pages:
        rightindex - paginator.num_pages
    
    custom_range = range(leftindex, rightindex+1)
    return render(request, 'community/category.html', 
                  {
                      'category':c_page, 
                      'post_list':post_list,
                      'page_obj':page_obj,
                      'paginator':paginator,
                      'custom_range':custom_range,
                      'keyword':keyword,
                      'search_field':search_field,
                      },)

def detail(request, pk):
    # 게시글(Post) 중 pk(primary_key)를 이용해 하나의 게시글(post)를 검색
    detail = get_object_or_404(Board, pk=pk)
    return render(request, 'community/detail.html', {'detail':detail})