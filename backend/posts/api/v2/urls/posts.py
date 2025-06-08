from django.urls import path
from .. import views


urlpatterns = [
    # post-list
    path("", views.PostListAPIView.as_view(), name="post-list"),

    # post-detail
    path("post/<str:slug>/", views.PostDetailAPIView.as_view(), name="post-detail"),
    # author  can create post, update
    path("post/<str:slug>/comments/",
         views.CommentListCreateAPIView.as_view(), name="comments"),

    path(
        "post/<slug:slug>/comment/<int:comment_id>/",
        views.CommentDetailAPIView.as_view(),
        name="comment-detail"
    ),

    # post-like
    path("post/<slug:slug>/like/", views.PostLikeAPIView.as_view(), name="post-like"),

    # authors posts
    path("author/<slug:slug>/posts/", views.AuthorPostsAPIView.as_view(), name="author-posts"),
    path("feed/", views.FeedAPIView.as_view(), name="author-posts"),


    # post-bookmark
    path("post/<slug:slug>/bookmark/", views.PostBookmarkAPIView.as_view(), name="post-bookmark"),
]
