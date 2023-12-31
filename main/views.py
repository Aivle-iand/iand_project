from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.shortcuts import render, redirect
from django.contrib import messages

def custom_main_view(request):
    return render(request, "main.html")

from django.contrib.auth import get_user