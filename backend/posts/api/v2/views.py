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
    PostSerializer
)

from posts.models import (
    Post, Tag
)

User = get_user_model()


class PostListAPIView(generics.GenericAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.filter(status=True)

    def get(self, request, *args, **kwargs):
        posts = self.get_queryset()
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)


class PostDetailAPIView(generics.GenericAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.filter(status=True)

    def get(self, request, slug, *args, **kwargs):
        album = get_object_or_404(self.get_queryset(), slug=slug)
        serializer = self.get_serializer(album)
        return Response(serializer.data)

