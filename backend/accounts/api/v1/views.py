# rest_framework imports
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
# django imports
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
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
    ProfileSerializer
)
from ..utils import EmailThread
User = get_user_model()
from ...models import Profile

class RegistrationApiView(generics.GenericAPIView):
    serializer_class = RegistrationSerializer

    def post(self, request, *args, **kwargs):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            email = serializer.validated_data["email"]
            data = {"email": email}

            user_obj = get_object_or_404(User, email=email)
            token = self.get_tokens_for_user(user_obj)
            email_obj = EmailMessage(
                "email/activation_email.tpl",
                {"token": token},
                settings.EMAIL_HOST_USER,
                to=[email],
            )

            EmailThread(email_obj).start()
            print(email_obj)
            return Response(data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_tokens_for_user(self, user):
        refresh = RefreshToken.for_user(user)

        return str(refresh.access_token)


class ActivationAPIView(APIView):
    def get(self, request, token, *args, **kwargs):

        decoded_payload, error_message = self.decode_jwt_token(token)

        if decoded_payload:
            user_id = decoded_payload["user_id"]
            user_obj = User.objects.get(id=user_id)
            if user_obj.verified:
                return Response(
                    {"message": "your account already Activate"},
                    status=status.HTTP_200_OK,
                )
            user_obj.verified = True
            user_obj.save()
            return Response(
                {"message": "Token is valid", "data": decoded_payload},
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
            return None, "Token has expired"
        except jwt.InvalidTokenError:
            return None, "Token is invalid"


class ActivationResendAPIView(generics.GenericAPIView):
    serializer_class = ActivationResendSerializer

    def post(self, request,  *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        user_obj = serializer.user_obj
        if user_obj.verified:
            return Response(
                {"message": "Your account is already activated"},
                status=status.HTTP_200_OK,
            )

        # Generate a new activation token
        token = self.get_tokens_for_user(user_obj)

        # Send activation email
        email_obj = EmailMessage(
            "email/activation_email.tpl",
            {"token": token},
            settings.EMAIL_HOST_USER,
            to=[email],
        )
        EmailThread(email_obj).start()

        return Response(
            {"message": "Activation email has been resent..."}, status=status.HTTP_200_OK
        )

    def get_tokens_for_user(self, user):
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)


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

    def get_object(self):
        return get_object_or_404(self.queryset, user=self.request.user)
