from django.db import models
from django.urls import reverse
from django.utils import timezone
from django.conf import settings

class Category(models.Model):
    name = models.CharField(max_length=250, unique=True, verbose_name='category')
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
    postname = models.CharField(max_length=64, verbose_name='')
    contents = models.TextField(verbose_name='')
    registered_date = models.DateTimeField(auto_now_add=True)
    writer = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.CASCADE, verbose_name='작성자')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name='게시판 목록')
    post_count = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return self.postname
    def comment_count(self):
        return Comment.objects.filter(post=self).count()
    def counter(self):
        self.post_count = self.post_count + 1
        self.save()
    def krtime(self):
        return self.registered_date.astimezone(timezone.pytz.timezone('Asia/Seoul'))
    class Meta:
        db_table = "community_board"
        verbose_name = "게시물"
        verbose_name_plural = "게시물"
     
class Comment(models.Model):
    post = models.ForeignKey(Board, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.CASCADE)
    content = models.TextField(verbose_name='')
    created = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.content
    
    class Meta:
        db_table = 'comment'
        verbose_name = "댓글"
        verbose_name_plural = "댓글"

        