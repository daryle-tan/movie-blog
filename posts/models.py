from django.db import models
from django.core import validators as v

class Posts(models.Model):
    post_title = models.CharField(blank=False, max_length=100)

    post_content = models.CharField(blank=False, max_length=32000)

    post_date = models.DateField(auto_now_add=True)
