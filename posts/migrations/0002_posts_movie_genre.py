# Generated by Django 5.1.4 on 2025-01-28 04:57

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='posts',
            name='movie_genre',
            field=models.CharField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
