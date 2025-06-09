# rest_framework imports

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly

from rest_framework.filters import SearchFilter
# django imports
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from drf_yasg.utils import swagger_auto_schema

# local imports
from ..serializers.post_serializers import (
    PostSerializer,
)


from posts.models import (
    Post, PostBookmark
)
from accounts.models import Profile, Follow

from ..permissions import IsAuthorOrReadOnly

User = get_user_model()

class PostListAPIView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.filter(status=True)
    permission_classes = [IsAuthorOrReadOnly]
    filter_backends = [SearchFilter]
    # ordering_fields = ['created_at', 'updated_at']
    # filterset_fields = ['categories', 'tags']
    search_fields = ['title', 'description']

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


class FeedAPIView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # list of users that the current user is following
        list_of_following = Follow.objects.filter(
            from_user=self.request.user).values_list('to_user', flat=True)
        # if the user is not following anyone, return no posts
        if not list_of_following:
            return Post.objects.none()
        # filter posts from those users that are published (status=True)
        qs = Post.objects.filter(
            author__in=list_of_following,
            status=True
        ).order_by('-created_at').select_related("author").prefetch_related("tags", 'categories')
        return qs


# make a bookmark for a post
class TogglePostBookmarkAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, slug):
        post = get_object_or_404(Post, slug=slug)
        user = request.user

        try:
            bookmark, created = PostBookmark.objects.get_or_create(
                user=user, post=post)
        except ValueError as e:
            # Handle the case where a user tries to bookmark their own post
            # This is a custom validation in the PostBookmark model
            return Response({"detail": str(e)}, status=400)
        if not created:
            # Bookmark already exists → remove it
            bookmark.delete()
            return Response({"detail": "Bookmark removed."}, status=200)

        return Response({"detail": "Post bookmarked."}, status=201)
