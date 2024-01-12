from django.shortcuts import render, redirect, get_object_or_404
from django.urls import path
from .forms import *
from .models import *
from accounts.models import User
from django.http import JsonResponse
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.views.decorators.http import require_POST
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def writepage(request):
    if not request.user.is_authenticated:
        return redirect('/accounts/login')
    
    if request.method == 'POST':
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.writer = request.user
            post.save()
            catecate = request.POST.get('category','')
            cate_dict = {'1':'announcement', '2':'freeboard', '3':'qna'}
            catecate = cate_dict[catecate]
            return redirect('/community/'+catecate, post.id)
    else:
        print(request.method, 'in else')
        form = PostForm()
        print(form)
        return render(request, 'community/writepage.html', {'form':form})
    
def categoryView(request, c_slug=None):
    c_page = None
    keyword, search_field = request.GET.get('keyword', ''), request.GET.get('search_field', '0')
    
    if c_slug != None:
        c_page = get_object_or_404(Category, slug=c_slug)
        post_list = Board.objects.filter(category=c_page).order_by('-id')
    else:
        post_list = Board.objects.all().order_by('-id')
    post_list = post_list.prefetch_related('comments')
    
    if search_field == '0':
        post_list = post_list.filter(postname__icontains = keyword)
    else:
        users = User.objects.all() # user 데이터 전부
        users = users.filter(nickname__icontains=keyword) # keyword와 일치하는 user 가져옥
        empty = Board.objects.none() # 빈 테이블 선언
        # 반복문으로 users
        for user in users:
            empty = empty.union(post_list.filter(writer=user))
        post_list = empty
    
    post_list = post_list.order_by('-id')
    page = request.GET.get('page')
    paginator = Paginator(post_list, 10)
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
    comment_form = CommentForm()
    comments = detail.comments.all()
    visited_posts = request.session.get('visited_posts', [])
    
    catecate_id = detail.category_id
    cate_dict = {'1':'announcement', '2':'freeboard', '3':'qna'}
    category = cate_dict[str(catecate_id)]

    if pk not in visited_posts:
        # 처음 방문하는 글이라면 조회수 증가
        detail.counter()
 
        # 세션에 방문한 글 기록
        visited_posts.append(pk)
        request.session['visited_posts'] = visited_posts
    context = {
        'detail':detail,
        'comment_form':comment_form,
        'comments':comments,
        'category':category,
    }
    if request.method == 'POST':
        if request.user.is_authenticated:
            if request.user == detail.writer:
                detail.delete()
                return redirect('community:post_by_category', c_slug=category)
            return redirect('community:detail')
    else:
        return render(request, 'community/detail.html', context)

    
def update(request, pk):
    detail = get_object_or_404(Board, pk=pk)
    if request.user == detail.writer:
        if request.method == "POST":
            form = PostUpdate(request.POST, instance=detail)
            if form.is_valid():
                detail.postname = form.cleaned_data['postname']
                detail.contents = form.cleaned_data['contents']
                detail.save()
                return redirect('/community/detail/'+str(detail.id))
        else:
            form = PostUpdate(instance=detail)
        context = {'form':form}
        return render(request, 'community/update.html', {'form':form})
    else:
        return redirect('community:detail')   

def comments_create(request, pk):
    if request.user.is_authenticated:
        detail = get_object_or_404(Board, pk=pk)
        comment_form = CommentForm(request.POST)
        if comment_form.is_valid():
            comment = comment_form.save(commit=False)
            comment.post= detail
            comment.user = request.user
            comment.save()
        return redirect('community:detail', detail.pk)
    return redirect('accounts:login')

def comments_delete(request, detail_pk, comment_pk):
    if request.user.is_authenticated:
        comment = get_object_or_404(Comment, pk=comment_pk)
        if request.user == comment.user:
            comment.delete()
    return redirect('community:detail', detail_pk)

def is_super(request):
    user_id = request.user
    print(user_id)
    user = User.objects.get(username=user_id)
    context = {
        'is_super': user.is_superuser,
    }
    
    return JsonResponse(context)
    
    
def comments_modify(request, detail_pk, comment_pk):
    if request.user.is_authenticated:
        comment = get_object_or_404(Comment, pk=comment_pk, user=request.user)
        if request.user == comment.user:
            form = CommentForm(request.POST, instance=comment)
            if form.is_valid():
                form.save()
    return redirect('community:detail', detail_pk)