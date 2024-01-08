from django.test import TestCase

# Create your tests here.
def index(request):
    search_query, filter_option, categoryOption = request.GET.get('search', ''), request.GET.get('filter_option', ''), request.GET.get('categoryOption', '')
    voice, face = request.GET.get('voice', ''), request.GET.get('face', '')
    checked_card = request.GET.get('checked_card', '')
    voice_change, face_change = 0, 0
    books = Book.objects.all()

    if filter_option == '1':
        books = books.filter(quiz=1)
    elif filter_option == '0':
        books = books.filter(quiz=0)
        
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
    
    if voice:
        voice_path = os.path.abspath(__file__)
        voice_path, _ = os.path.split(voice_path)
        voice_path +=  '/static/playground/user/' + master_id + '/' + str(voice) + '/voice'
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
                    text_to_speach(tfs, master_id ,master_key,voice_path,file_name)
        voice_change = 1   
        
    if face:
        face_path = os.path.abspath(__file__)
        face_path, _ = os.path.split(face_path)
        face_path +=  '/static/playground/user/' + master_id + '/' + str(face) + '/face'
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
                    # image_bg =  'media\\'+scene_.image
                    image_bg = f'/Users/seongjiko/AIVLE_BIG/iand_project/media/contents/{face}_{epi}_{sce}.png'
                    image_face = f'/Users/seongjiko/AIVLE_BIG/iand_project/temp_target.png'
                    # image_face  =  유저 얼굴
                    face_swap(master_face_key, image_bg, image_face, img_file)

        face_change = 1  
        
        
    context = { 'books': books,
                "search_query": search_query,
                "filter_option" : filter_option,
                "categoryOption":categoryOption,    
                "voice":voice,
                "face":face,
                "checked_card" : checked_card,
                 }  
    if episodes:
        context['episodes'] = episodes
    
    if voice_change == 1:
        context['voice_change'] = voice_change
        
    if face_change == 1:
        context['face_change'] = face_change
   
    return render(request, 'playground/lol.html', context)