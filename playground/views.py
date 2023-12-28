from django.shortcuts import render
from .models import Book


def index(request):
    search_query, filter_option, categoryOption = request.GET.get('search', ''), request.GET.get('filter', ''), request.GET.get('categoryOption', '')
    voice, face = request.GET.get('voice', ''), request.GET.get('face', '')
    
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

    if voice:
        pass
        # 여기서 음성 api 써야 합니다. 
    if face:
        pass
        # 여기서 얼굴 합성 api 써야 합니다. 
        # ex) reading_book = books.filter(id=face)
        # ex) api 코드 

    return render(request, 'playground/lol.html', {'books': books, "search_query": search_query, "filter_option" : filter_option, "categoryOption":categoryOption, "voice":voice, "face":face})





def profile_view(request):
    profiles = Book.objects.all()
    return render(request, 'playground/lol.html', {'profiles': profiles})




# episode 불러오는 view 함수 추가
from django.shortcuts import render, get_object_or_404

def book_detail(request, book_id, episode_number=None):
    book = get_object_or_404(Book, pk=book_id)
    if episode_number:
        episodes = book.episodes.filter(episode_number=episode_number)
    else:
        episodes = book.episodes.all()

    return render(request, 'playground/lol.html', {'book': book, 'episodes': episodes})