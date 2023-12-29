from django.shortcuts import render, redirect, get_object_or_404
from django.urls import path
from .forms import PostForm
from .models import *
from django.http import HttpResponse
from django.views.generic import ListView, DetailView
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
# from login.models import User

def writepage(request):
    if request.method == 'POST':
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save()
            return redirect('/community/', post.id)
        else:
            form = PostForm()
        return render(request, 'community/writepage.html', {'form':form})
    else:
        form = PostForm()
        return render(request, 'community/writepage.html', {'form':form})
    
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
    if request.method == 'POST':
        detail.delete()
        return redirect('/community/')
    else:
        return render(request, 'community/detail.html', {'detail':detail})

    
def up_post(request, pk):
    detail = get_object_or_404(Board, pk=pk)
    # # if request.user_id != detail.writer:
    #     message.error(request, '수정 권한이 없습니다.')
    #     return redirect('community:detail', user_id=pk)
    if request.method == "POST":
        form = PostForm(request.POST, instance=detail)
        if form.is_valid():
            detail = form.save(commit=False)
            detail.modify_date = timezone.now()
            detail.save()
            return redirect('community/detail'+str(pk), {'detail':detail})
    else:
        form = PostForm(instance=detail)
    context = {'form':form}
    return render(request, 'community/update.html', form)