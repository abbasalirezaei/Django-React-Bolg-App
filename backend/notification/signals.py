from django.db.models.signals import post_save
from django.dispatch import receiver


from posts.models import PostComment, PostLike as Like
from accounts.models.follow import Follow
from .models import Notification


# Signals to handle user profile creation and notifications
@receiver(post_save, sender=Follow)
def create_follow_notification(sender, instance, created, **kwargs):
    if created:
        Notification.objects.get_or_create(
            recipient=instance.to_user,
            actor=instance.from_user,
            notification_type='FOLLOW'
        )

@receiver(post_save, sender=PostComment)
def create_comment_notification(sender, instance, created, **kwargs):
    # prevent notification for comments made by the user on their own posts
    if created and instance.user != instance.post.author: 
        Notification.objects.get_or_create(
            recipient=instance.post.author,
            actor=instance.user,
            notification_type='COMMENT',
            post=instance.post,
            
        )

@receiver(post_save, sender=Like)
def create_like_notification(sender, instance, created, **kwargs):
    # prevent notification for likes made by the user on their own posts
    if created and instance.user != instance.post.author: 
        Notification.objects.get_or_create(
            recipient=instance.post.author,
            actor=instance.user,
            notification_type='LIKE',
            post=instance.post
        )
