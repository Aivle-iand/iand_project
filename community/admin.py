from django.contrib import admin

# Register your models here.
from .models import *
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name', )}

admin.site.register(Board)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Comment)
