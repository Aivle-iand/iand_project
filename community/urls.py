# blog/urls.py
from django.urls import path
from . import views
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static

app_name = 'community'
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.categoryView, name='post_all'),
    # path("<str:category_name>/", views.categoryView, name="category",)
    # path('freeboard', views.freeboard, name='freeboard'),
    # path('qna', views.qna, name='qna'),
    path('writepage', views.writepage, name='writepage'),
    # path('', views.announcement, name='announcement'),
    path('<slug:c_slug>/', views.categoryView, name='post_by_category'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)