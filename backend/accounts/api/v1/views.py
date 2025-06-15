# rest_framework imports

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
# django imports
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

from django.core.mail import send_mail


from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string


# third part imports
from mail_templated import EmailMessage
from rest_framework_simplejwt.views import TokenObtainPairView


# decoding
import jwt
from django.conf import settings
from rest_framework_simplejwt.settings import api_settings


# local imports
from .serializers import (
    RegistrationSerializer,
    CustomTokenObtainSerializer,
    ActivationResendSerializer,
    ChangePasswordSerializer,
    ProfileSerializer,
    FollowSerializer,
    UserSerializer
)
from posts.api.v2.serializers import PostBookmarkSerializer
from posts.models import PostBookmark
from ...models import Profile, Follow

from ..utils import EmailThread, send_activation_email
User = get_user_model()


class RegistrationApiView(generics.GenericAPIView):
    serializer_class = RegistrationSerializer

    def post(self, request, *args, **kwargs):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            email = serializer.validated_data["email"]
            data = {
                "email": email,
                "message": "Account created successfully, please check your email to activate your account."
            }
            return Response(data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ActivationAPIView(APIView):
    def get(self, request, token, *args, **kwargs):

        decoded_payload, error_message = self.decode_jwt_token(token)

        if decoded_payload:
            user_id = decoded_payload["user_id"]
            user_obj = User.objects.get(id=user_id)
            if user_obj.verified:
                return Response(
                    {"message": "Your account is already activated."},
                    status=status.HTTP_200_OK,
                )
            user_obj.verified = True
            user_obj.is_active = True
            user_obj.save()
            return Response(
                {"message": "Your account has been activated successfully.",
                    "data": decoded_payload},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"error": error_message}, status=status.HTTP_400_BAD_REQUEST
            )

    def decode_jwt_token(self, token):
        try:
            decoded_payload = jwt.decode(
                token, settings.SECRET_KEY, algorithms=[api_settings.ALGORITHM]
            )
            return decoded_payload, None
        except jwt.ExpiredSignatureError:
            return None, "Token has expired and is no longer valid please request a new one"
        except jwt.InvalidTokenError:
            return None, "Token is invalid please request a new one"


class ActivationResendAPIView(generics.GenericAPIView):
    serializer_class = ActivationResendSerializer

    def post(self, request, *args, **kwargs):
        # Validate the request data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        user_obj = serializer.user_obj
        # Check if the account is already verified

        if user_obj.verified:
            return Response(
                {"message": "Your account is already activated"},
                status=status.HTTP_200_OK,
            )

        send_activation_email(user_obj, email)
        return Response(
            {"message": "Activation Email has been reset ... "}, status=status.HTTP_200_OK
        )


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainSerializer


class ChangePasswordAPIView(generics.GenericAPIView):
    """
    An endpoint for changing password.
    """

    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = (IsAuthenticated,)

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def put(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():

            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response(
                    {"old_password": ["Wrong password."]},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            response = {
                "status": "success",
                "code": status.HTTP_200_OK,
                "message": "Password updated successfully",
                "data": [],
            }
            return Response(response)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    permission_classes = [IsAuthenticated]
    swagger_tags = ['profile']
    def get_object(self):
        return get_object_or_404(self.queryset, user=self.request.user)


# follwing and followers

class FollowUserView(APIView):
    permission_classes = [IsAuthenticated]
    swagger_tags = ['follow']
    def post(self, request, user_id):
        try:
            user_to_follow = User.objects.get(id=user_id)
            if user_to_follow == request.user:
                return Response({"error": "You cannot follow yourself."}, status=status.HTTP_400_BAD_REQUEST)
            if not user_to_follow.is_active:
                return Response({"error": "User is not active yet."}, status=status.HTTP_400_BAD_REQUEST)   
            follow, created = Follow.objects.get_or_create(
                from_user=request.user, to_user=user_to_follow)
            if not created:
                return Response({"error": "You already follow this user."}, status=status.HTTP_400_BAD_REQUEST)

            serializer = UserSerializer(user_to_follow)
            return Response({
                "message": f"You are now following {user_to_follow.email}",
                "user": serializer.data
            }, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)


class UnfollowUserView(APIView):
    permission_classes = [IsAuthenticated]
    swagger_tags = ['follow']
    def post(self, request, user_id):
        try:
            user_to_unfollow = User.objects.get(id=user_id)
            follow = Follow.objects.filter(
                from_user=request.user, to_user=user_to_unfollow)
            if follow.exists():
                follow.delete()
                serializer = UserSerializer(user_to_unfollow)
                return Response({
                    "message": f"You have unfollowed {user_to_unfollow.email}",
                    "user": serializer.data
                }, status=status.HTTP_204_NO_CONTENT)
            return Response({"error": "You are not following this user."}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)


class FollowerListView(APIView):
    swagger_tags = ['follow']
    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            followers = Follow.objects.filter(to_user=user)
            serializer = FollowSerializer(followers, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)


class FollowingListView(APIView):
    swagger_tags = ['follow']
    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            following = Follow.objects.filter(from_user=user)
            serializer = FollowSerializer(following, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)


# bookmarks
class UserBookmarksAPIView(generics.ListAPIView):
    swagger_tags = ['bookmarks']
    serializer_class = PostBookmarkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return user.bookmarked_posts.all()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
