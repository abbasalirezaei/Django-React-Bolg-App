# accounts/urls.py
from django.urls import path
from ..views import (
    FollowUserView,
    UnfollowUserView,
    FollowerListView, FollowingListView,
)
app_name="follow"
urlpatterns = [
    path('follow/<int:user_id>/', FollowUserView.as_view(), name='follow-user'),
    path('unfollow/<int:user_id>/', UnfollowUserView.as_view(), name='unfollow-user'),
    path('followers/<int:user_id>/', FollowerListView.as_view(), name='follower-list'),
    path('following/<int:user_id>/', FollowingListView.as_view(), name='following-list'),
]
