from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import Posts
from comments.models import Comments
from user_app.models import User
from .serializers import PostSerializer, CommentSerializer, UserSerializer
from django.shortcuts import get_object_or_404
from django.contrib.auth.views import redirect_to_login
from django.shortcuts import redirect

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
    
    def delete(self, request, post_id):
        try:
            posts = Posts.objects.get(id=post_id)
            posts.delete()
            return Response({"success": "Post deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Posts.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

class CommentView(APIView):

    def get(self, request, post_id, comment_id=None):
        post = get_object_or_404(Posts, id=post_id)
        if comment_id is None:
            comments = Comments.objects.filter(post=post)
            serializer = CommentSerializer(comments, many=True)
        else:
            comment = get_object_or_404(Comments, id=comment_id, post=post)
            serializer = CommentSerializer(comment)
        return Response(serializer.data)
    
    def post(self, request, post_id):
        if not request.user.is_authenticated:
            return Response({"error": "User must be logged in to comment."}, status=status.HTTP_401_UNAUTHORIZED)
    
        post = get_object_or_404(Posts, id=post_id)
        serializer = CommentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(post=post)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, post_id, comment_id):
        post = get_object_or_404(Posts, id=post_id)
        comment = get_object_or_404(Comments, id=comment_id, post=post)

        if "comment" in request.data:
            comment.comment = request.data["comment"]
            comment.save()

            serializer = CommentSerializer(comment)
            return Response(serializer.data)
        
    def delete(self, request, post_id, comment_id):
        try:
            post = get_object_or_404(Posts, id=post_id)
            comment = get_object_or_404(Comments, id=comment_id, post=post)
            comment.save()
            return Response({"success": "Comment deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Comments.DoesNotExist:
            return Response({"error": "Comment not found"}, status=status.HTTP_404_NOT_FOUND)
