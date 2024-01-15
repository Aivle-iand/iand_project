from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', include('main.urls')),
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('accounts/', include('allauth.urls')),
    path('playground/', include('playground.urls')),
    path('community/', include('community.urls')),
    path('mypage/', include('mypage.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    
