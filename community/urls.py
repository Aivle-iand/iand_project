# blog/urls.py
from django.urls import path, include
from . import views
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static

app_name = 'community'
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.categoryView, name='community_board'),
    path('writepage/', views.writepage, name='writepage'),
    path('<slug:c_slug>/', views.categoryView, name='post_by_category'),
    path('detail/<int:pk>/', views.detail, name='detail'),
    path('update/<int:pk>/', views.update, name='update'),
    path('<int:pk>/comments/', views.comments_create, name='comments_create'),
    path('detail/<int:detail_pk>/comments/<int:comment_pk>/delete/', views.comments_delete, name='comments_delete'),
    path('accounts/', include('accounts.urls')),
    path('writepage/is_super/', views.is_super),
    path('detail/<int:detail_pk>/comments/<int:comment_pk>/modify/', views.comments_modify, name='comments_modify'),
]


if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)