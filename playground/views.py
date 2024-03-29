from django.shortcuts import render, redirect
from .models import Book, QuizHistory
import requests
from pydub import AudioSegment
import os
import environ
from base64 import b64encode
from PIL import Image
from io import BytesIO
from django.http import JsonResponse, HttpResponse
from django.shortcuts import get_object_or_404
from mypage.models import UserProfile
from django.conf import settings

env = environ.Env(
    DEBUG=(bool, False)
)

environ.Env.read_env(
    env_file=os.path.join(settings.BASE_DIR, 'secrets.config')
)

master_key = env('VOICE_API_KEY')
master_face_key = env('FACE_API_KEY')
    
def toB64(image_path):
    if 's3' in image_path:
        image_url = 'https://' + image_path
        response = requests.get(image_url)
        if response.status_code == 200:
            return b64encode(response.content).decode('utf-8')
        else:
            raise Exception(f"Error fetching {image_url}: Status code {response.status_code}")
    else:
        with open(image_path, "rb") as image_file:
            return b64encode(image_file.read()).decode('utf-8')
    

def face_swap(api_key, bg_image_path, face_image_path, save_path):
    url = "https://api.segmind.com/v1/sd2.1-faceswapper"
    data = {
        "input_face_image": toB64(face_image_path), # 입힐 얼굴
        "target_face_image": toB64(bg_image_path), # 백그라운드
        "file_type": "png",
        "face_restore": True
    }

    response = requests.post(url, json=data, headers={'x-api-key': api_key})

    image = Image.open(BytesIO(response.content))
    image.save(save_path)



def text_to_speach(text_for_sound, unique_voice_id ,api_key ,voice_save_path ,file_name):
    CHUNK_SIZE = 1024
    url = "https://api.elevenlabs.io/v1/text-to-speech/" + unique_voice_id

    headers = {
    "Accept": "audio/mpeg",
    "Content-Type": "application/json",
    "xi-api-key": api_key
    }
    
    data = {
    "text": text_for_sound,
    "model_id": "eleven_multilingual_v2",
    "voice_settings": {
        "stability": 1,
        "similarity_boost": 1,
        "use_speaker_boost": True
        }
    }
    
    response = requests.post(url, json=data, headers=headers)
    
    file_path = voice_save_path
    name = file_name
    os.makedirs(file_path,exist_ok=True)
    with open(file_path+name, 'wb') as f:
        for chunk in response.iter_content(chunk_size=CHUNK_SIZE):
            if chunk:
                f.write(chunk)

def index(request):
    search_query, filter_option, categoryOption = request.GET.get('search', ''), request.GET.get('filter_option', ''), request.GET.get('categoryOption', '')
    checked_card = request.GET.get('checked_card', '')
   
    books = Book.objects.all()
    books = books.order_by('-lock')
   
    if filter_option:        
        if request.user.is_authenticated:
            readed = QuizHistory.objects.filter(correct_users=request.user.id)
            empty = Book.objects.none()
            for one_b in readed:
                for book in one_b.read_book.all():
                    empty = empty.union(Book.objects.filter(id=book.id))
            if filter_option == '1':
                books = empty
            elif filter_option == '0':
                books = books.exclude(id__in=empty.values('id'))
        else:
            filter_option = ''
       
    if search_query:
        books = books.filter(name__icontains=search_query)
               
    if categoryOption:
        if categoryOption == '0':
            pass  
        else:
            cate = {'1':'과학자', '2':'수학자', '3': '철학자', '4':'음악가'}
            books = books.filter(category=cate[categoryOption])
   
 
   
    if checked_card:
        human = books.get(id=int(checked_card))
        hu = human.episodes.all()
        episodes = [hu.filter(episode_number=1), hu.filter(episode_number=2), hu.filter(episode_number=3)]
    else:
        episodes = []
           
    context = { 'books': books,
                "search_query": search_query,
                "filter_option" : filter_option,
                "categoryOption":categoryOption,    
                "checked_card" : checked_card,
                 }  
    if episodes:
        context['episodes'] = episodes
 
    return render(request, 'playground/lol.html', context)


def voice_face_change(request, checked_card):
    if request.user.is_authenticated and request.method == 'POST':
        user_profile = get_object_or_404(UserProfile, user=request.user)
        voice, face = request.POST.get('voice', ''), request.POST.get('face', '')
        voice_change, face_change = 0, 0
        human = get_object_or_404(Book, id=int(checked_card))
        hu = human.episodes.all()
        episodes = [hu.filter(episode_number=1), hu.filter(episode_number=2), hu.filter(episode_number=3)]
        
        if face: 
            face_path = os.path.abspath(__file__)
            face_path, _ = os.path.split(face_path)
            face_path +=  '/static/playground/user/' + str(request.user.username) + '/' + str(face) + '/face'
            if not os.path.exists(face_path):
                os.makedirs(face_path)
            for epi in '123':
                for sce in '1234':
                    file_name = '/' + str(face) +'_'+epi+'_'+ sce +'.png'
                    img_file = os.path.join(face_path+file_name)
                    if os.path.exists(img_file):
                        continue
                    else:
                        scene_ = episodes[int(epi)-1].get(scene_number=sce)
                        image_bg =  face_path.split('iand_project')[0] + 'iand_project/media/contents' + file_name
                        image_face = request.user.profile.image_url
                        face_swap(master_face_key, image_bg, image_face, img_file)
            face_change = 1  
        

        if voice: 
            voice_path = os.path.abspath(__file__)
            voice_path, _ = os.path.split(voice_path)
            voice_path +=  '/static/playground/user/' + str(request.user.username) + '/' + str(voice) + '/voice'
            if not os.path.exists(voice_path):
                os.makedirs(voice_path)
            for epi in '123':
                for sce in '1234':
                    file_name = '/'+str(voice)+'_'+epi+'_'+ sce +'.mp3'
                    mp3_file = os.path.join(voice_path+file_name)
                    if os.path.exists(mp3_file):
                        continue
                    else:
                        scene_ = episodes[int(epi)-1].get(scene_number=sce)
                        tfs = scene_.voice_text
                        text_to_speach(tfs, request.user.profile.audio_url , master_key, voice_path, file_name)
        
            voice_change = 1
            

        context = {}
        context['voice_change'] = voice_change
        context['face_change'] = face_change  

        return JsonResponse(context)

    
    else:
      return HttpResponse("조건에 맞지 않음", status=400)
    


# quiz
def score_quiz(request, book_id):
    if request.method == 'POST':
        book = Book.objects.get(id=book_id)
        quizzes = book.quizzes.all()
        score = 0
        total = quizzes.count()
        answers = {}
        isCorrect = {}

        for index, quiz in enumerate(quizzes):
            user_answer = request.POST.get(f'input_{quiz.quiz_index}') 
            is_correct = user_answer == quiz.quiz_answer 
            isCorrect[index] = is_correct;
            answers[f'quiz_{quiz.quiz_index}'] = is_correct
            if user_answer == quiz.quiz_answer:
                score += 1
        
        if score == total:
            quiz_history, created = QuizHistory.objects.get_or_create()
            quiz_history.correct_users.add(request.user)
            quiz_history.read_book.add(book)

        return JsonResponse({'score': score, 'total': total, 'answers': answers, 'isCorrect': isCorrect,})

   
    


