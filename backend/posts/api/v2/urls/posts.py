from django.urls import path
from .. import views


urlpatterns = [
    # post-list
    path("",views.PostListAPIView.as_view(),name="post-list"),

    # post-detail
    path("post/<str:slug>/",views.PostDetailAPIView.as_view(),name="post-detail"),
    # author  can create post, update 



]
