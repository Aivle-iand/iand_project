from django.contrib import admin

# Register your models here.
from .models import Post

# Register your models here.
# 관리자(admin)가 게시글(Post)에 접근 가능
admin.site.register(Post)
# admin.site.register(Comment)