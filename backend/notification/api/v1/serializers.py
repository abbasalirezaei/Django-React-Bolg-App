from notification.models import Notification
from rest_framework import serializers

class NotificationSerializer(serializers.ModelSerializer):
    actor_email = serializers.CharField(source='actor.email', read_only=True)
    post_title = serializers.CharField(source='post.title', read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id',
            'notification_type',
            'actor_email',
            'post_title',
            'read',
            'created_at',
        ]