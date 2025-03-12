from django.db import models
from django.core import validators as v

class Posts(models.Model):
    post_title = models.CharField(blank=False, max_length=100)
    post_content = models.CharField(blank=False, max_length=32000)
    movie_genre = models.CharField(blank=False)
    post_date = models.DateField(auto_now_add=True)


    def post_title_update(self, new_post_title):
        self.post_title = new_post_title
        self.save()

    def post_content_update(self, new_content_update):
        self.post_content = new_content_update
        self.save()

    def movie_genre_update(self, new_genre):
        self.movie_genre = new_genre
        self.save()
