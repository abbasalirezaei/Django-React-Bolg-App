# rest_framework imports

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.exceptions import ValidationError
from rest_framework.filters import SearchFilter
# django imports
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from drf_yasg.utils import swagger_auto_schema


from datetime import timedelta
from django.utils import timezone
from django.db.models import Count

# local imports
from ..serializers.post_serializers import (PostSerializer,PostListSerializer)
from ..permissions import IsAuthorOrReadOnly, WeeklyPostLimit, WeeklyPostBookmarkLimit

from posts.api.utils import get_client_ip
from posts.models import (Post, PostBookmark)
from accounts.models import Profile, Follow


User = get_user_model()


class PostListAPIView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.filter(status=Post.PostStatus.PUBLISHED)
    permission_classes = [
        IsAuthorOrReadOnly,
        WeeklyPostLimit
    ]
    filter_backends = [SearchFilter]
    search_fields = ['title', 'description']

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class TopViewedPostsAPIView(generics.ListAPIView):
    serializer_class = PostListSerializer

    def get_queryset(self):
        return Post.objects.order_by('-view_count')[:10]

class TopCommentedPostsAPIView(generics.ListAPIView):
    serializer_class = PostListSerializer

    def get_queryset(self):
        return Post.objects.annotate(num_comments=Count('comments')).order_by('-num_comments')[:10]


class PostDetailAPIView(generics.RetrieveUpdateAPIView):
    queryset = Post.objects.filter(status=Post.PostStatus.PUBLISHED)
    serializer_class = PostSerializer
    permission_classes = [IsAuthorOrReadOnly,]
    lookup_field = "slug"

    def retrieve(self, request, *args, **kwargs):
        post = self.get_object()
        ip_address = get_client_ip(request)

        post.increment_views(ip_address)

        serializer = self.get_serializer(post)
        return Response(serializer.data)


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
        # filter posts from those users that are published 
        qs = Post.objects.filter(
            author__in=list_of_following,
            status=Post.PostStatus.PUBLISHED
        ).order_by('-created_at').select_related("author").prefetch_related("tags", 'categories')
        return qs


# make a bookmark for a post
class TogglePostBookmarkAPIView(APIView):
    permission_classes = [IsAuthenticated, WeeklyPostBookmarkLimit]

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
