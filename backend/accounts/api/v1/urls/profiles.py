from django.urls import path, include

from .. import views
urlpatterns = [
    path('', views.ProfileAPIView.as_view(), name='profile'),
    path('bookmarks/', views.UserBookmarksAPIView.as_view(), name='post-bookmark'),
]
