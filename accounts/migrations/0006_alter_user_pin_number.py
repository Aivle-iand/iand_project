# Generated by Django 5.0 on 2024-01-05 17:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_alter_user_pin_number'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='pin_number',
            field=models.CharField(default='default-key', max_length=100),
        ),
    ]