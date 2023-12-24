from django.db import models
# Create your models here.
# 게시글(Post)엔 제목(postname), 내용(contents)이 존재합니다
class Board(models.Model):
    postname = models.CharField(max_length=64, verbose_name="제목")
    contents = models.TextField()
    # registered_date = models.DateTimeField(auto_now_add=True, verbose_name="등록 시간")
    # writer = models.ForeignKey('users.Users', verbose_name="글쓴이", on_delete=models.CASCADE)

    # 게시글의 제목(postname)이 Post object 대신하기
    def __str__(self):
        return self.postname
    
    class Meta:
        db_table = "community_board"
        verbose_name = "게시물"
        verbose_name_plural = "게시물"

class Comment(models.Model):
    post = models.ForeignKey(Board, on_delete=models.CASCADE)
    author = models.CharField(max_length=20)
    message = models.TextField()
    created = models.DateField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

