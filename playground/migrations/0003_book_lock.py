# Generated by Django 5.0 on 2024-01-04 14:24

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("playground", "0002_remove_episodes_title_book_ep_title_1_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="book",
            name="lock",
            field=models.IntegerField(default=0),
        ),
    ]