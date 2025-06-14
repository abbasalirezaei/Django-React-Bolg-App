from django.db import models


class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('FOLLOW', 'Follow'),
        ('COMMENT', 'Comment'),
        ('COMMENT_LIKE', 'Comment Like'),
        ('LIKE', 'Like'),
        ('PUBLISH', 'Post Published'),
    )

    notification_type = models.CharField(
        max_length=20,
        choices=NOTIFICATION_TYPES, help_text="Type of notification"
    )
    recipient = models.ForeignKey(
        'accounts.User',
        related_name='notifications',
        on_delete=models.CASCADE,
        help_text="User receiving the notification"
    )
    actor = models.ForeignKey(
        'accounts.User',
        related_name='actions',
        on_delete=models.CASCADE,
        help_text="User who triggered the notification"
    )

    post = models.ForeignKey(
        'posts.Post',  # Assuming 'posts.Post' is the correct path to the Post model
        related_name='notifications',
        null=True, blank=True,
        on_delete=models.CASCADE,
        help_text="Related post, if applicable"
    )
    read = models.BooleanField(
        default=False, help_text="Whether the notification has been read")
    created_at = models.DateTimeField(
        auto_now_add=True, help_text="Date created")
    updated_at = models.DateTimeField(auto_now=True, help_text="Last updated")

    class Meta:
        indexes = [
            models.Index(fields=['recipient', 'created_at']),
        ]
        db_table = 'Notifications'
        managed = True
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.actor.username} {self.notification_type.lower()}ed {self.recipient.username}"

    def mark_as_read(self):
        """Mark the notification as read."""
        self.read = True
        self.save() 
