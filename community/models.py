from django.db import models
from django.urls import reverse
from django.utils import timezone
# from login.models import User

# Create your models here.
# 게시글(Post)엔 제목(postname), 내용(contents)이 존재합니다
class Category(models.Model):
    name = models.CharField(max_length=250, unique=True)
    slug = models.SlugField(max_length=250, unique=True)
    description = models.TextField(blank=True)
    
    class Meta:
        db_table = 'community_category'
        verbose_name = 'category'
        verbose_name_plural = 'categories'
    
    def __str__(self):
        return '{}'.format(self.name)
    
    def get_url(self):
        return reverse('community:post_by_category', args=[self.slug])

class Board(models.Model):
    postname = models.CharField(max_length=64, verbose_name="제목")
    contents = models.TextField()
    registered_date = models.DateField(auto_now_add=True)
    # writer = models.ForeignKey(User, verbose_name="글쓴이", on_delete=models.CASCADE)
    # writer = models.CharField(max_length=50, verbose_name='작성자')
    category = models.ForeignKey(Category, null=True, blank=True, on_delete=models.CASCADE)
    # slug = models.SlugField(max_length=64, unique=True, null=True)
    
    # 게시글의 제목(postname)이 Post object 대신하기
    def __str__(self):
        return self.postname
    class Meta:
        db_table = "community_board"
        verbose_name = "게시물"
        verbose_name_plural = "게시물"
        
# class Comment(models.Model):
#     post = models.ForeignKey(Board, on_delete=models.CASCADE)
#     author = models.CharField(max_length=20)
#     message = models.TextField()
#     created = models.DateField(auto_now_add=True)
#     updated = models.DateTimeField(auto_now=True)

# class Users(models.Model):
    
    