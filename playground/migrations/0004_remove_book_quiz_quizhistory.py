# Generated by Django 5.0 on 2024-01-05 15:33

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("playground", "0003_book_lock"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RemoveField(
            model_name="book",
            name="quiz",
        ),
        migrations.CreateModel(
            name="QuizHistory",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "correct_users",
                    models.ManyToManyField(
                        blank=True, help_text="정답을 맞힌 사용자", to=settings.AUTH_USER_MODEL
                    ),
                ),
                (
                    "read_book",
                    models.ManyToManyField(
                        blank=True, help_text="읽은 책", to="playground.book"
                    ),
                ),
            ],
        ),
    ]