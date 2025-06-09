# rest_framework imports
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, serializers
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly

from rest_framework.filters import SearchFilter
# django imports
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from drf_yasg.utils import swagger_auto_schema

# local imports
from ..serializers import (
    PostSerializer,
    PostCommentSerializer,
    PostBookmarkSerializer
)


from posts.models import (
    Post, Tag, PostComment, PostLike, PostBookmark, CommentLike
)
from accounts.models import Profile, Follow

from ..permissions import IsAuthorOrReadOnly

User = get_user_model()
# Post Likes
class PostLikeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['posts-likes'])
    def post(self, request, slug):
        post = get_object_or_404(Post, slug=slug, status=True)
        like, created = PostLike.objects.get_or_create(
            post=post, user=request.user)

        if not created:
            return Response({"detail": "You have already liked this post."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Post liked successfully."}, status=status.HTTP_201_CREATED)

    @swagger_auto_schema(tags=['posts-likes'])
    def delete(self, request, slug):
        post = get_object_or_404(Post, slug=slug, status=True)
        try:
            like = PostLike.objects.get(post=post, user=request.user)
            like.delete()
            return Response({"detail": "Post unliked successfully."}, status=status.HTTP_204_NO_CONTENT)
        except PostLike.DoesNotExist:
            return Response({"detail": "You have not liked this post."}, status=status.HTTP_400_BAD_REQUEST)
