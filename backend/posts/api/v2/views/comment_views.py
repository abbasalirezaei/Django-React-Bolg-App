# rest_framework imports
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
# django imports
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from drf_yasg.utils import swagger_auto_schema

# local imports
from ..serializers.comment_serializers import (
    PostCommentSerializer,
)


from posts.models import (
    Post,PostComment,CommentLike
)

User = get_user_model()

class CommentListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = PostCommentSerializer

    def get_queryset(self):
        post_slug = self.kwargs.get('slug')
        post = get_object_or_404(Post, slug=post_slug, status=True)
        return PostComment.objects.filter(post=post).order_by('-created_at')

    def perform_create(self, serializer):
        post = get_object_or_404(Post, slug=self.kwargs['slug'], status=True)
        serializer.save(post=post, user=self.request.user)


class CommentDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostCommentSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return PostComment.objects.all()

    def get_object(self):
        post = get_object_or_404(Post, slug=self.kwargs["slug"], status=True)
        return get_object_or_404(
            self.get_queryset(), id=self.kwargs["comment_id"], post=post
        )

# ToggleComment Like

class ToggleCommentLikeAPIView(APIView):
    """
    ToggleCommentLikeAPIView allows users to like or unlike a comment.
    - If created is True, a new like was added.
    - If created is False, the like already existed and is removed.
    """
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(tags=['comments-likes'])
    def post(self, request, comment_id):
        comment = get_object_or_404(PostComment, id=comment_id)

        like, created = CommentLike.objects.get_or_create(
            user=request.user, comment_blog_item=comment
        )

        if not created:
            like.delete()
            return Response(
                {"detail": "Comment unliked successfully."},
                status=status.HTTP_200_OK
            )

        return Response(
            {"detail": "Comment liked successfully."},
            status=status.HTTP_201_CREATED
        )

