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
    
    def post(self, request):
        serializer = PostSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, post_id):
        posts = Posts.objects.get(id=post_id)

        if "post_title" in request.data:
            posts.post_title_update(request.data["post_title"])
            posts.save()
        if "post_content" in request.data:
            posts.post_content_update(request.data["post_content"])
            posts.save()
        if "movie_genre" in request.data:
            posts.movie_genre_update(request.data["movie_genre"])
            posts.save()
        
        serializer = PostSerializer(posts)
        return Response(serializer.data)
    
    def delete(self, request, category_id):
        try:
            posts = Posts.objects.get(id=category_id)
            posts.delete()
            return Response({"success": "Post deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Posts.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
