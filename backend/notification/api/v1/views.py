# rest_framework imports
from rest_framework.response import Response
from rest_framework import generics, permissions
from rest_framework import status

# local imports
from notification.api.v1.serializers import NotificationSerializer
from notification.models import Notification


class NotificationListView(generics.ListAPIView):
    """
    API view to retrieve a list of notifications for the authenticated user.
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Return notifications for the authenticated user, ordered by creation date.
        and selecting related fields for performance.
        """
        return Notification.objects.filter(
            recipient=self.request.user
        ).order_by('-created_at').select_related('actor', 'post')

    def get(self, request, *args, **kwargs):
        """
        Handle GET requests to retrieve notifications.
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class NotificationDetailView(generics.RetrieveAPIView):
    """
    API view to retrieve a specific notification by its ID.
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        """
        Return notifications for the authenticated user, ordered by creation date.
        """
        return Notification.objects.filter(
            recipient=self.request.user
        ).order_by('-created_at').select_related('actor', 'post')

    def get(self, request, *args, **kwargs):
        """
        Handle GET requests to retrieve a specific notification.
        """
        return super().get(request, *args, **kwargs)
    
class MarkNotificationReadView(generics.UpdateAPIView):
    """
    API view to mark a notification as read.
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        """
        Return notifications for the authenticated user, ordered by creation date.
        """
        return Notification.objects.filter(
            recipient=self.request.user
        ).order_by('-created_at').select_related('actor', 'post')

    def update(self, request, *args, **kwargs):
        """
        Handle PUT requests to mark a notification as read.
        """
        instance = self.get_object()
        instance.read = True
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)