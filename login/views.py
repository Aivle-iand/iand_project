from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
# views.py

def custom_signin_view(request):
    return render(request, "login.html")

def custom_signup_view(request):
    return render(request, "signup.html")