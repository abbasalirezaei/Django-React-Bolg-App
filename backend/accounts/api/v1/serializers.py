# rest_framework imports
from rest_framework import  exceptions, serializers


# django import
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password


# third party imports 
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
# locals import
from django.contrib.auth import get_user_model
User = get_user_model()


class RegistrationSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, max_length=128)
    password = serializers.CharField(write_only=True, max_length=128)
    full_name = serializers.CharField(max_length=255)

    class Meta:
        model = User
        fields = ["email", "password", "password1", "full_name"]

    def validate(self, attrs):
        # Run default validations
        attrs = super().validate(attrs)

        password = attrs.get("password")
        password1 = attrs.get("password1")
        errors = {}

        # Check if both passwords match
        if password != password1:
            errors["password1"] = "Passwords do not match"

        # Validate password strength using Django's built-in validators
        try:
            dummy_user = User(email=attrs.get("email", ""))
            validate_password(password=password, user=dummy_user)
        except exceptions.ValidationError as e:
            errors["password"] = list(e.messages)

        if errors:
            raise serializers.ValidationError(errors)

        return attrs

    def create(self, validated_data):
        # Remove password1 as it's not a User model field
        validated_data.pop("password1", None)

        # Extract full_name to use for profile after user is saved
        full_name = validated_data.pop("full_name", "")

        # Create the user instance
        user = User(email=validated_data["email"])
        user.set_password(validated_data["password"])
        user.save()

        # Update the related profile with full_name
        if hasattr(user, "profile"):
            user.profile.full_name = full_name
            user.profile.save()

        return user


class CustomTokenObtainSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        validate_data = super().validate(attrs)

        if not self.user.is_verified:
            msg = "Unable to log in with provided credentials."
            raise serializers.ValidationError(msg)
        validate_data["user_id"] = self.user.id
        validate_data["user_email"] = self.user.email

        return validate_data