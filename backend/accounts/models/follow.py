"""
Follower model

Fields:
- form_user: Follower
- to_user: Followed
- updated_at: Last update
- created_at: Date followed
"""

from django.db import models

from accounts.models import User

# Create your models here.


class Follow(models.Model):
    """Followers"""

    from_user = models.ForeignKey(
        User,
        related_name="following",
        on_delete=models.CASCADE,
        help_text="Follower",
    )
    to_user = models.ForeignKey(
        User,
        related_name='followers',
        on_delete=models.CASCADE,
        help_text="Followed",
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Last update",
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Date followed",
    )

    class Meta:
        """Meta data"""

        indexes = [models.Index(fields=["from_user", "to_user"])]
        constraints = [
            models.UniqueConstraint(
                fields=["from_user", "to_user"],
                name="unique_follower",
            )
        ]

    def __str__(self):
        return f"{self.from_user.email} follows {self.to_user.email}"
