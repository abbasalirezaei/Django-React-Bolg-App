from django.urls import path
from ..views import like_views as views


urlpatterns = [

    # post-like
     path("post/<slug:slug>/like/",
         views.PostLikeAPIView.as_view(), name="post-like"),

]
