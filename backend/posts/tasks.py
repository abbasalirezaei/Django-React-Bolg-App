from celery import shared_task
from asgiref.sync import async_to_sync
from django.utils import timezone

from posts.models import Post
from notification.models import Notification


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
