# rest_framework imports


from rest_framework import exceptions, serializers

# third party imports
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# django import
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password


from django.utils import timezone
from datetime import timedelta
# locals import
from ...models import Profile, Follow
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
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            role="reader",
            verified=False,
            is_active=False
        )

        # Update the related profile with full_name
        if hasattr(user, "profile"):
            user.profile.full_name = full_name
            user.profile.save()

        return user


class CustomTokenObtainSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        validate_data = super().validate(attrs)

        if not self.user.verified:
            msg = "Unable to log in with provided credentials, first you have to verify your account."
            raise serializers.ValidationError(msg)
        validate_data["user_id"] = self.user.id
        validate_data["user_email"] = self.user.email

        return validate_data


class ActivationResendSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        """
        Ensure the email exists in the system before resending activation.
        """
        user_obj = User.objects.filter(email=value).first()

        if not user_obj:
            raise serializers.ValidationError(
                "No account found with this email.")

        # Store the user instance for later access in the view
        self.user_obj = user_obj
        return value


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password1 = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate(self, attrs):
        errors = {}
        new_password1 = attrs.get("new_password1")
        new_password = attrs.get("new_password")
        if new_password1 != new_password:
            errors["new_passwords"] = ["New Passwords do not match."]

        try:
            validate_password(password=new_password, user=None)
        except exceptions.ValidationError as e:
            errors["new_password"] = list(e.messages)

        if errors:
            raise serializers.ValidationError(errors)

        return super().validate(attrs)


class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.CharField(source="user.email", read_only=True)
    user_comments = serializers.SerializerMethodField()
    user_likes = serializers.SerializerMethodField()
    user_posts = serializers.SerializerMethodField()
    followers = serializers.SerializerMethodField()
    following = serializers.SerializerMethodField()

    premium_status = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [
            "email",
            "slug",
            "full_name",
            "bio",
            "image",
            "user_posts",
            "user_likes",
            "user_comments",
            "followers",
            "following",
            "premium_status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["slug", "created_at", "updated_at"]

    def get_is_premium(self, obj):
        """Check if user's premium is active"""
        return obj.is_premium and (obj.premium_expiry is None or obj.premium_expiry > timezone.now())

    def get_premium_status(self, obj):
        """Return premium status details"""

        is_premium = self.get_is_premium(obj)
        expiry = obj.premium_expiry if is_premium else None
        days_left = (expiry - timezone.now()).days if expiry else None

        # remaining_posts default value
        remaining_posts = 0
        # if user is not an author or is a premium user, set unlimited posts
        if obj.user.role == "author" and not is_premium:
            one_week_ago = timezone.now() - timedelta(days=7)
            weekly_post_count = obj.user.posts.filter(
                status=True,
                created_at__gte=one_week_ago
            ).count()
            remaining_posts = max(0, 5 - weekly_post_count)

        message = (
            f"{days_left} days left" if is_premium else
            "Not a premium user. You can only write 5 blog posts per week."
        )
        # result dictionary 
        return {
            "active": is_premium,
            "expiry": expiry,
            "days_left": days_left,
            "remaining_weekly_posts": "unlimited" if is_premium else remaining_posts,
            "message": message
        }

    def get_user_comments(self, obj):
        """Retrieve all comments made by the user"""
        return obj.user.comments.values("post__title", "content", "created_at")

    def get_followers(self, obj):
        """Retrieve users who follow this user"""
        follow_qs = obj.user.followers.select_related("from_user").all()

        data = []
        for follow in follow_qs:
            user = follow.from_user
            data.append({
                "id": user.id,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "joined": user.date_joined
            })
        return {
            "count": len(data),
            "users": data
        }

    def get_following(self, obj):
        """Retrieve users that this user is following"""
        follow_qs = obj.user.following.select_related("to_user").all()

        data = []
        for follow in follow_qs:
            user = follow.to_user
            data.append({
                "id": user.id,
                "username": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "joined": user.date_joined
            })
        return {
            "count": len(data),
            "users": data
        }

    def get_user_likes(self, obj):
        """Retrieve all likes made by the user"""
        return obj.user.likes.values("post__title")

    def get_user_posts(self, obj):
        """Retrieve all posts created by the user"""

        if obj.user.role != "author":
            return None

        posts = obj.user.posts.prefetch_related("comments", "likes").all()

        data = []
        for post in posts:
            post_data = {
                "id": post.id,
                "title": post.title,
                "created_at": post.created_at,
                "comments": list(post.comments.values("content", "created_at", "user__email")),
                "likes_count": len(post.likes.all())
            }
            data.append(post_data)

        return data


# follwing serializers
class UserSerializer(serializers.ModelSerializer):
    follower_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'follower_count', 'following_count']

    def get_follower_count(self, obj):
        return Follow.objects.filter(to_user=obj).count()

    def get_following_count(self, obj):
        return Follow.objects.filter(from_user=obj).count()


class FollowSerializer(serializers.ModelSerializer):
    from_user = serializers.CharField(source='from_user.email')
    to_user = serializers.CharField(source='to_user.email')

    class Meta:
        model = Follow
        fields = ['from_user', 'to_user', 'created_at']
