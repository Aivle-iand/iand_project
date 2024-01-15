from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.shortcuts import render, redirect
from django.contrib import messages
from community.models import Board
from django.contrib.auth import get_user

def custom_main_view(request):
    board = Board.objects.filter(category=1).order_by('-id').values_list('id', 'postname', 'writer', 'registered_date', 'writer')[:10]
    nickname = Board.objects.filter(category=1).select_related('writer').order_by('-id').values_list('writer__nickname', flat=True)

    ids = [item[0] for item in board]
    postnames = [item[1] for item in board]
    writers = [item[2] for item in board]
    dates = [item[3] for item in board]
    notices = zip(postnames, ids, writers, dates, nickname)
    context = {
        'notices': notices,
    }

    return render(request, "main.html", context)
