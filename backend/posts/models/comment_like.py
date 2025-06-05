from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model

from .post_comment import PostComment

User = get_user_model()

class CommentLike(models.Model):
    user = models.ForeignKey(
        User,
        verbose_name=_("User"),
        on_delete=models.CASCADE
    )
    comment_blog_item = models.ForeignKey(
        PostComment,
        on_delete=models.CASCADE,
        verbose_name=_("Comment")
    )

    class Meta:
        unique_together = ('user', 'comment_blog_item')
        verbose_name = _("Comment like")
        verbose_name_plural = _("Comment likes")

    def __str__(self):
        return f"CommentLike({self.user}, {self.comment_blog_item})"
