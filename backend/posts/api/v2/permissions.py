from rest_framework import permissions


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
