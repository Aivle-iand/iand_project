# Generated by Django 5.0 on 2024-01-08 05:39

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("community", "0007_alter_board_registered_date"),
    ]

    operations = [
        migrations.AlterField(
            model_name="board",
            name="registered_date",
            field=models.DateTimeField(
                default=datetime.datetime(
                    2024, 1, 8, 5, 39, 52, 511789, tzinfo=datetime.timezone.utc
                )
            ),
        ),
    ]