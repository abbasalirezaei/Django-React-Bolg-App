# posts/api/v2/views/__init__.py
from .post_views import (
    PostListAPIView,
    PostDetailAPIView,
    AuthorPostsAPIView,
    FeedAPIView,
    TogglePostBookmarkAPIView
)
from .comment_views import (
    CommentListCreateAPIView,
    CommentDetailAPIView,
    ToggleCommentLikeAPIView,
)
from .like_views import PostLikeAPIView

__all__ = [

    "PostListAPIView",
    "PostDetailAPIView",
    "AuthorPostsAPIView",
    "FeedAPIView",
    "TogglePostBookmarkAPIView"
    "CommentListCreateAPIView",
    "CommentDetailAPIView",
    "ToggleCommentLikeAPIView",
    "PostLikeAPIView"
]
