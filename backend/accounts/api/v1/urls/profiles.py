from django.urls import path, include

from .. import views
urlpatterns = [
    path('', views.ProfileAPIView.as_view(), name='profile')
]
