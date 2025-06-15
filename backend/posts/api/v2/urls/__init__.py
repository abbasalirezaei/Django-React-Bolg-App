from django.urls import path, include

urlpatterns = [
    path("", include("posts.api.v2.urls.posts_urls")),
    path("", include("posts.api.v2.urls.comments_urls")),
    path("", include("posts.api.v2.urls.likes_urls")),
]
