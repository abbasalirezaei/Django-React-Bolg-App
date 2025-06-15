from django.urls import path
from ..views import post_views as views


urlpatterns = [
    # post-list
    path("", views.PostListAPIView.as_view(), name="post-list"),
    path("top-viewed/", views.TopViewedPostsAPIView.as_view(),name='top-viewed-posts'),
    path("top-commented/", views.TopCommentedPostsAPIView.as_view(),name='top-commented-posts'),



    # post-detail
    path("post/<str:slug>/", views.PostDetailAPIView.as_view(), name="post-detail"),

    # authors posts
    path("author/<slug:slug>/posts/",
         views.AuthorPostsAPIView.as_view(), name="author-posts"),
    path("feed/", views.FeedAPIView.as_view(), name="author-posts"),


    # post-bookmark
    path("post/<slug:slug>/bookmark-toggle/",
         views.TogglePostBookmarkAPIView.as_view(), name="post-bookmark-toggle"),
]
