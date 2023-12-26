from django.shortcuts import render
from .models import Book


def index(request):
    search_query = request.GET.get('search', '')
    filter_option = request.GET.get('filter', '')
    categoryOption = request.GET.get('categoryOption', '')
    
    books = Book.objects.all()

    if filter_option == '1':
        books = books.filter(quiz=1)
    elif filter_option == '0':
        books = books.filter(quiz=0)
        
    if search_query:
        books = books.filter(name__icontains=search_query)
        
        
        
    if categoryOption:
        if categoryOption == '0':  # '전체' 선택 시 모든 책 보여주기
            pass  # 모든 책을 이미 불러왔으므로 추가 조건 없음
        else:
            cate = {'1':'과학자', '2':'수학자', '3': '철학자', '4':'음악가'}
            books = books.filter(category=cate[categoryOption])

    return render(request, 'playground/lol.html', {'books': books, "search_query": search_query, "filter_option" : filter_option, "categoryOption":categoryOption })





def profile_view(request):
    profiles = Book.objects.all()
    return render(request, 'playground/lol.html', {'profiles': profiles})