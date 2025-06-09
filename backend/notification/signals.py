from django.db.models.signals import post_save,post_delete
from django.dispatch import receiver


from posts.models import PostComment,CommentLike , PostLike as Like 
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


# send notefication when a comment is liked
@receiver(post_save, sender=CommentLike)
def create_comment_like_notification(sender, instance, created, **kwargs):
    # prevent notification for likes made by the user on their own comments
    if created and instance.user != instance.comment_blog_item.user: 
        Notification.objects.get_or_create(
            recipient=instance.comment_blog_item.user,
            actor=instance.user,
            notification_type='COMMENT_LIKE',
            post=instance.comment_blog_item.post, 
        )
# delete notification when a comment like is deleted
@receiver(post_delete, sender=CommentLike)
def delete_comment_like_notification(sender, instance, **kwargs):
    Notification.objects.filter(
        recipient=instance.comment_blog_item.user,
        actor=instance.user,
        notification_type='COMMENT_LIKE',
        post=instance.comment_blog_item.post,
    ).delete()