from django.db import models
from django.core import validators as v
from posts.models import Posts
from user.models import User

class Comments(models.Model):

    comment = models.CharField(max_length=255)

    comment_date = models.DateField(auto_now_add=True)

    comment_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')

    post = models.ForeignKey(Posts, on_delete=models.CASCADE, related_name='comments')

    def comment_update(self, new_comment):
        self.comment = new_comment
        self.save()

