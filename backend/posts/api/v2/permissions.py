from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied

from datetime import timedelta
from django.utils import timezone


from posts.models import Post, PostBookmark
from accounts.api.utils import is_premium_user


class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Allow safe methods (GET, HEAD, OPTIONS) for everyone.
    Only authenticated users with role 'author' can modify.
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
    """
    Restrict non-premium authors to 5 posts per week.
    """
    message = "You can only publish up to 5 posts per week. Upgrade to premium to post more."

    def has_permission(self, request, view):
        user = request.user

        if request.method != "POST":
            return True  # Only applies to creating posts

        if not user.is_authenticated:
            return False

        if getattr(user, 'role', None) != 'author':
            raise PermissionDenied(
                "Only users with author role can create posts."
            )

        # Premium users can post unlimited
        if is_premium_user(user):
            return True

        """
            If the user is not a premium:
        """
        # Calculate the date one week ago from now
        one_week_ago = timezone.now() - timedelta(days=7)

        # Count number of posts in the past 7 days
        weekly_post_count = Post.objects.filter(
            author=user, created_at__gte=one_week_ago, status=True
        ).count()

        # If the count is 5 or more, deny permission
        if weekly_post_count >= 5:
            raise PermissionDenied(self.message)

        return weekly_post_count < 5


class WeeklyPostBookmarkLimit(permissions.BasePermission):
    message = "You can only bookmark up to 10 posts per week. Upgrade to premium to bookmark more."

    def has_permission(self, request, view):
        user = request.user

        if request.method != "POST":
            return True

        if not user.is_authenticated:
            return False

        if is_premium_user(user):
            # Premium users can bookmark unlimited posts
            return True

        # Limit for regular users
        one_week_ago = timezone.now() - timedelta(days=7)
        weekly_bookmark_count = PostBookmark.objects.filter(
            user=user,
            created_at__gte=one_week_ago
        ).count()

        return weekly_bookmark_count < 10
