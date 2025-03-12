from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import User
import logging
from django.middleware.csrf import get_token
from django.contrib.auth import authenticate
from django.shortcuts import redirect 
import os 

logger = logging.getLogger(__name__)

class GetCSRFTokenView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({"csrfToken": get_token(request)})
  

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def dispatch(self, request, *args, **kwargs):
        logger.info(f"Dispatching request to RegisterView: method={request.method}, path={request.path}, headers={dict(request.headers)}")
        response = super().dispatch(request, *args, **kwargs)
        logger.info(f"Dispatch response: status={response.status_code}, data={response.data if hasattr(response, 'data') else 'N/A'}")
        return response

    def post(self, request):
        logger.info(f"Received POST to register with data: {request.data}")
        email = request.data.get('email')
        password = request.data.get('password')
        username = request.data.get('username', None)
        
        logger.info(f"Parsed request: email={email}, username={username}, password={'***' if password else None}")
        
        if not email or not password:
            logger.error("Missing email or password")
            return Response({"error": "Email and password required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=email).exists():
            logger.error(f"Email {email} already taken")
            return Response({"error": "Email already taken"}, status=status.HTTP_400_BAD_REQUEST)
        
        if username and User.objects.filter(username=username).exists():
            logger.error(f"Username {username} already taken")
            return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            logger.info(f"Creating user with email={email}, username={username}")
            user = User.objects.create_user(email=email, password=password, username=username)
            logger.info(f"User created: {user.username} ({user.email})")
            token = Token.objects.create(user=user)
            logger.info(f"Token created: {token.key}")
            return Response({"token": token.key, "username": user.username, "email": user.email}, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Registration failed: {str(e)}")
            return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({"error": "Email and password required"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(request, username=email, password=password) 
        
        if user:
            token, created = Token.objects.get_or_create(user=user)
            logger.info(f"Token {'created' if created else 'retrieved'} for {user.username} ({user.email})")
            return Response({'token': token.key, "username": user.username, "email": user.email}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

login_view = LoginView.as_view()

class GoogleLoginCallbackView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        user = request.user
        logger.info(f"Google callback triggered for user: {user}")
        
        if user.is_authenticated:
            token, created = Token.objects.get_or_create(user=user)
            
            if created or not hasattr(user, 'social_id'):
                social_account = user.socialaccount_set.first()
                if social_account:
                    user.social_id = social_account.uid
                    extra_data = social_account.extra_data
                    if 'picture' in extra_data:
                        user.avatar = extra_data['picture']
                    user.save()
                    logger.info(f"Updated user {user.username} with Google data")
            
            # Use environment variable for frontend URL
            frontend_url = os.getenv('FRONTEND_URL', 'http://127.0.0.1:3000') + '/callback/'
            redirect_url = (
                f"{frontend_url}"
                f"?token={token.key}"
                f"&username={user.username}"
                f"&email={user.email}"
            )
            logger.info(f"Redirecting to frontend: {redirect_url}")
            return redirect(redirect_url)
        
        return Response({"error": "Authentication failed"}, status=401)