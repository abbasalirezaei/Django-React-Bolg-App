# rest_framework imports
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, serializers
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
# django imports
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from drf_yasg.utils import swagger_auto_schema

# local imports
from .serializers import (
    PostSerializer,
    PostCommentSerializer,
    PostBookmarkSerializer
)


from posts.models import (
    Post, Tag, PostComment, PostLike, PostBookmark
)
from accounts.models import Profile, Follow

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

@swagger_auto_schema(
    operation_summary="Retrieve, Update, or Delete a Comment",
    operation_description="Allows users to retrieve, update or delete a specific comment by ID.",
    tags=["comments"]
)
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


class PostBookmarkAPIView(generics.CreateAPIView):
    serializer_class = PostBookmarkSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        post_slug = self.kwargs.get('slug') 
        post = get_object_or_404(Post, slug=post_slug)
        
        # Prevent duplicate bookmarks
        if PostBookmark.objects.filter(user=user, post=post).exists():
            raise serializers.ValidationError({"detail": "You have already bookmarked this post."})
            
        serializer.save(user=user, post=post)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

