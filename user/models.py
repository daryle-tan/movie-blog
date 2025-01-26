from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
   
    social_id = models.CharField(max_length=255, blank=True, null=True)
    avatar = models.URLField(blank=True, null=True)

    username = None
    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []