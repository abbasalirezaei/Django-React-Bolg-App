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
from .serializers import (
    PostSerializer,
    PostCommentSerializer,
    PostBookmarkSerializer
)


from posts.models import (
    Post, Tag, PostComment, PostLike, PostBookmark, CommentLike
)
from accounts.models import Profile, Follow

from .permissions import IsAuthorOrReadOnly

User = get_user_model()

"""
list of views for the posts app:
1. PostListAPIView: for listing and creating posts just author can create.
2. PostDetailAPIView: for retrieving, updating, and deleting a specific post by slug just author can update or delete.
3. CommentListCreateAPIView: for listing and creating comments on a specific post, just authenticated users can create comments.
4. CommentDetailAPIView: for retrieving, updating, and deleting a specific comment by ID.
5. PostLikeAPIView: for liking and unliking a post, just authenticated users can like or unlike.
6. AuthorPostsAPIView: for listing posts by a specific author.
7. FeedAPIView: for listing posts from users that the current user is following.
8. TogglePostBookmarkAPIView: for bookmarking and unbookmarking a post, just authenticated users can bookmark or unbookmark.
9. CommentLikeAPIView: for liking and unliking a comment, just authenticated users can like or unlike comments.

"""


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
