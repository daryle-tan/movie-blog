from django.urls import path
from .views import RegisterView, login_view, GoogleLoginCallbackView, GetCSRFTokenView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', login_view, name='login'),
    path('google-callback/', GoogleLoginCallbackView.as_view(), name='google_callback'),
    path('get-csrf-token/', GetCSRFTokenView.as_view(), name='get_csrf_token'),
]