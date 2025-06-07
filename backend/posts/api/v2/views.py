# rest_framework imports
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated,IsAuthenticatedOrReadOnly
# django imports
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model


# local imports
from .serializers import (
    PostSerializer,
    PostCommentSerializer
)


from posts.models import (
    Post, Tag, PostComment
)
from accounts.models import Profile

from .permissions import IsAuthorOrReadOnly

User = get_user_model()


class PostListAPIView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.filter(status=True)
    permission_classes = [IsAuthorOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user, status=False)



class PostDetailAPIView(generics.GenericAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.filter(status=True)
    permission_classes = [IsAuthorOrReadOnly]
    lookup_field = "slug"

    def get(self, request, slug, *args, **kwargs):
        post = self.get_object()
        serializer = self.get_serializer(post)
        return Response(serializer.data)

    def put(self, request, slug, *args, **kwargs):
        post = self.get_object()
        serializer = self.get_serializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, slug, *args, **kwargs):
        post = self.get_object()
        serializer = self.get_serializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



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


# Author Post list:


class AuthorPostsAPIView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        profile_slug = self.kwargs.get("slug")
        profile = get_object_or_404(Profile, slug=profile_slug)
        user = profile.user

        if user.role != "author":
            return Post.objects.none()

        return Post.objects.filter(author=user).select_related("author")