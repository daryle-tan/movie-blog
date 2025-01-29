from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import Posts
from .serializers import PostSerializer, CommentSerializer, UserSerializer
from django.shortcuts import get_object_or_404

class PostView(APIView):
    def get(self,request, post_id=None):
        if post_id:
            try:
                posts = Posts.objects.get(id=post_id)
                serializer = PostSerializer(posts)
                return Response(serializer.data)
            except Posts.DoesNotExist:
                return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            posts = Posts.objects.all()
            serializer = PostSerializer(posts, many=True)
            return Response(serializer.data)
    
    