from rest_framework import serializers
from .models import Posts
from comments.models import Comments
from user.models import User
from rest_framework.response import Response

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Posts
        fields = ['id', 'post_title', 'post_content', 'movie_genre', 'post_date']

class CommentSerializer(serializers.ModelSerializer):
    posts = serializers.PrimaryKeyRelatedField(source='post', queryset = Posts.objects.all())

    users = serializers.PrimaryKeyRelatedField(source='comment_user', queryset = User.objects.all())

    class Meta:
        model = Comments
        fields = ['id', 'comment', 'comment_date', 'posts', 'users']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'social_id', 'avatar', 'email']