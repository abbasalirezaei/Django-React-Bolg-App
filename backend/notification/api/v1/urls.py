from django.urls import path, include

from .views import (
    NotificationListView,
    NotificationDetailView,
    MarkNotificationReadView
)

"""
localhost:8000/api/v1/notifications/ ...
This module defines the URL patterns for the notification API version 1.
It includes paths for listing notifications, viewing notification details,
"""
app_name = 'notification-api-v1'
urlpatterns = [
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:id>/', NotificationDetailView.as_view(), name='notification-detail'),
    path('notifications/<int:id>/read/', MarkNotificationReadView.as_view(), name='mark-notification-read'),
]
