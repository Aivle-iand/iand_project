from django.contrib import admin

# Register your models here.
from .models import *

# Register your models here.
# 관리자(admin)가 게시글(Post)에 접근 가능
# class BoardAdmin(admin.ModelAdmin):
#     list_display = ('postname',)


admin.site.register(BoardAnn)

admin.site.register(BoardFree)

admin.site.register(BoardQna)