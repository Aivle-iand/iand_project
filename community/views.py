from django.shortcuts import render

# Create your views here.
def announcement(request):
    return render(request, 'announcement.html')

def freeboard(request):
    return render(request, 'freeboard.html')

def qna(request):
    return render(request, 'qna.html')
