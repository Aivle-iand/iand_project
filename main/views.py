from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.shortcuts import render, redirect
from django.contrib import messages
from community.models import Board
from django.contrib.auth import get_user

def custom_main_view(request):
    board = Board.objects.filter(category=1).order_by('-id').values_list('id', 'postname', 'writer', 'registered_date')[:10]

    # 각 속성을 리스트로 추출
    ids = [item[0] for item in board]  # id 값
    postnames = [item[1] for item in board]  # postname 값
    writers = [item[2] for item in board]  # writer 값
    dates = [item[3] for item in board]  # writer 값
    notices = zip(postnames, ids, writers, dates)
    # 컨텍스트에 각 리스트를 추가
    context = {
        'notices': notices,  # 전체 데이터
    }

    # 이제 이 context를 템플릿에 전달하면 됩니다.
    return render(request, "main.html", context)



# def notice_import(request):
# 쿼리셋 실행
    
