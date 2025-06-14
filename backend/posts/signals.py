from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils import timezone

from posts.models import Post

@receiver(pre_save, sender=Post)
def set_published_at(sender, instance, **kwargs):
    if instance.status == Post.PostStatus.PUBLISHED and not instance.published_at:
        instance.published_at = timezone.now()
