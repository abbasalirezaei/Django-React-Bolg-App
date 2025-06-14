from celery import shared_task
from asgiref.sync import async_to_sync
from django.utils import timezone
from datetime import timedelta

from posts.models import Post
from notification.models import Notification
from accounts.models import Follow

@shared_task
def publish_scheduled_posts():
    now = timezone.now()
    posts = Post.objects.filter(
        status=Post.PostStatus.SCHEDULED,
        publish_time__lte=now
    )

    for post in posts:
        post.status = Post.PostStatus.PUBLISHED
        post.save(update_fields=['status'])
        # sending notification to author
        Notification.objects.create(
            notification_type="PUBLISH",
            recipient=post.author,
            actor=post.author,
            post=post
        )
        
@shared_task
def notify_followers_of_new_posts():
    now = timezone.now()
    five_minutes_ago = now - timedelta(minutes=10)

    recent_posts = Post.objects.filter(
        status=Post.PostStatus.PUBLISHED,
        published_at__gte=five_minutes_ago,
        published_at__lte=now
    ).select_related("author")

    for post in recent_posts:
        followers = Follow.objects.filter(to_user=post.author).select_related("from_user", "from_user__profile")
        for follow in followers:
            user = follow.from_user
            if user.profile.is_premium:
                Notification.objects.create(
                    notification_type='FOLLOW',
                    recipient=user,
                    actor=post.author,
                    post=post
                )