from django.urls import path
from .. import views


urlpatterns = [
    # post-list
    path("", views.PostListAPIView.as_view(), name="post-list"),

    # post-detail
    path("post/<str:slug>/", views.PostDetailAPIView.as_view(), name="post-detail"),

    # post-like
    path("post/<slug:slug>/like/",
         views.PostLikeAPIView.as_view(), name="post-like"),

    # authors posts
    path("author/<slug:slug>/posts/",
         views.AuthorPostsAPIView.as_view(), name="author-posts"),
    path("feed/", views.FeedAPIView.as_view(), name="author-posts"),


    # post-bookmark
    path("post/<slug:slug>/bookmark-toggle/",
         views.TogglePostBookmarkAPIView.as_view(), name="post-bookmark-toggle"),
]
