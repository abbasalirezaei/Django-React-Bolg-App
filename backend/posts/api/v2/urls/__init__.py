from django.urls import path, include

urlpatterns = [
    path("", include("posts.api.v2.urls.posts")),
    path("", include("posts.api.v2.urls.comments")),


]
