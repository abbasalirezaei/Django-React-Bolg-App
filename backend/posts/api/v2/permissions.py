from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied

from datetime import timedelta
from django.utils import timezone


from posts.models import Post


class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Allow safe methods for everyone,
    but restrict write permissions to users with role 'author'.
    """

    def has_permission(self, request, view):
        # SAFE_METHODS: GET, HEAD, OPTIONS -> Always allowed
        if request.method in permissions.SAFE_METHODS:
            return True
        # For other methods like POST, only authors are allowed
        return request.user.is_authenticated and getattr(request.user, 'role', None) == "author"

    def has_object_permission(self, request, view, obj):
        # Everyone can read posts
        if request.method in permissions.SAFE_METHODS:
            return True
        # Only the original author of the post can modify or delete it
        return obj.author == request.user


class WeeklyPostLimit(permissions.BasePermission):
    message = "You can only publish up to 5 posts per week. Upgrade to premium to post more."

    def has_permission(self, request, view):
        user = request.user

        if request.method != "POST":
            return True

        if not user.is_authenticated:
            return False

        if getattr(user, 'role', None) != 'author':
            raise PermissionDenied(
                "Only users with author role can create posts.")

        # Check if the user has a profile
        try:
            profile = user.profile
        except AttributeError:
            raise PermissionDenied("User profile not found.")
        # If the user is a premium member, allow unlimited creation of posts
        if profile.is_premium and (not profile.premium_expiry or profile.premium_expiry > timezone.now()):
            return True
        
        # Calculate the date one week ago from now
        one_week_ago = timezone.now() - timedelta(days=7)
        
        # Check the number of posts created by the user in the last week
        weekly_post_count = Post.objects.filter(
            author=user, created_at__gte=one_week_ago, status=True
        ).count()

        # If the count is 5 or more, deny permission
        if weekly_post_count >= 5:
            raise PermissionDenied(self.message)

        return weekly_post_count < 5
