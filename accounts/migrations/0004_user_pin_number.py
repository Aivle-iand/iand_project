# Generated by Django 5.0 on 2024-01-05 17:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_loginhistory_country_loginhistory_ip'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='pin_number',
            field=models.CharField(default=0, max_length=4),
        ),
    ]
