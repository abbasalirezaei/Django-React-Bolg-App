from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model

from .post import Post

User = get_user_model()


class PostLike(models.Model):
    user = models.ForeignKey(
        User,
        verbose_name=_("User"),
        related_name="likes",
        on_delete=models.CASCADE
    )
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="likes",
        verbose_name=_("Post")
    )

    class Meta:
        unique_together = ("user", "post")
        verbose_name = _("Post like")
        verbose_name_plural = _("Post likes")

    def __str__(self):
        return f"PostLike({self.user}, {self.post})"
