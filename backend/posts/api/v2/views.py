# rest_framework imports
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
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

from .permissions import IsAuthorOrReadOnly

User = get_user_model()


class PostListAPIView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.filter(status=True)
    permission_classes = [IsAuthorOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user, status=False)


"""
class PostCommentCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, slug):
        post = get_object_or_404(Post, slug=slug, status=True)
        serializer = PostCommentCreateSerializer(data=request.data, context={"request": request, "post": post})
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Comment created."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
"""


class PostCommentCreateAPIView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PostCommentSerializer

    def post(self, request, slug):
        post = get_object_or_404(Post, slug=slug, status=True)
        serializer = self.get_serializer(
            data=request.data,
            # pass post and request to serializer
            context={'post': post, 'request': request}
        )
        if serializer.is_valid():
            comment = serializer.save()
            return Response(PostCommentSerializer(comment).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PostCommentDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostCommentSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return PostComment.objects.all()

    def get_object(self):
        post = get_object_or_404(Post, slug=self.kwargs["slug"], status=True)
        return get_object_or_404(
            self.get_queryset(), id=self.kwargs["comment_id"], post=post
        )

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
