from django.urls import path
from .views import PostView, CommentView

urlpatterns = [
    # Post paths
    path('', PostView.as_view(), name='get-all-posts'),
    path('<int:post_id>/', PostView.as_view(), name='get-post-by-id'),

    # Comment paths
    path('<int:post_id>/comments/', CommentView.as_view(), name='comment-read-create'),
    path('<int:post_id>/comments/<int:comment_id>/', CommentView.as_view(), name='comment-crud'),
]