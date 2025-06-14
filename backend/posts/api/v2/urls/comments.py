from django.urls import path
from .. import views


urlpatterns = [
    # comment-list-create
    path("post/<str:slug>/comments/",
         views.CommentListCreateAPIView.as_view(), name="comments"),
    # comment-detail-retrieve-update-delete
    path(
        "post/<slug:slug>/comment/<int:comment_id>/",
        views.CommentDetailAPIView.as_view(),
        name="comment-detail"
    ),

    # comment-like
    path(
        "comment/<int:comment_id>/like/",
        views.ToggleCommentLikeAPIView.as_view(),
        name="comment-like"
    ),
]
