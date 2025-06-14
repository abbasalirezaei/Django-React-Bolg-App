from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils.text import slugify
from django.contrib.auth import get_user_model


from django.utils import timezone
from .category import Category
from .tag import Tag
from .post_view import PostView

User = get_user_model()


class Post(models.Model):
    class PostStatus(models.TextChoices):
        DRAFT = "draft", "Draft"
        SCHEDULED = "scheduled", "Scheduled"
        PUBLISHED = "published", "Published"
        ARCHIVED = "archived", "Archived"

    title = models.CharField(_("Post title"), max_length=250)
    slug = models.SlugField(_("Slug"), unique=True, blank=True)
    author = models.ForeignKey(
        User,
        related_name="posts",
        null=True,
        on_delete=models.SET_NULL,
        verbose_name=_("Author")
    )
    categories = models.ManyToManyField(
        Category, related_name="posts", blank=True, verbose_name=_("Categories"))
    tags = models.ManyToManyField(
        Tag, related_name="posts", blank=True, verbose_name=_("Tags"))
    description = models.TextField(_("Post description"))
    short_description = models.CharField(
        _("Short description"), max_length=300, blank=True)
    reading_time = models.PositiveIntegerField(
        _("Reading time (minutes)"), default=0)
    img = models.ImageField(
        _("Post image"), upload_to="blog_image/", blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=PostStatus.choices,
        default=PostStatus.DRAFT,
        verbose_name=_("Post status")
    )

    publish_time = models.DateTimeField(
        _("Scheduled Publish Time"),
        null=True,
        blank=True,
        help_text="If set and status is 'scheduled', will be published automatically at this time"
    )
    is_featured = models.BooleanField(_("Featured"), default=False)
    view_count = models.PositiveIntegerField(_("View Count"), default=0)

    created_at = models.DateTimeField(_("Created at"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Updated at"), auto_now=True)

    class Meta:
        ordering = ("-created_at",)
        verbose_name = _("Post")
        verbose_name_plural = _("Posts")

    def __str__(self):
        return f"{self.title} by {self.author.email if self.author else 'Unknown'}"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)

        if not self.short_description:
            self.short_description = self.description[:150]

        self.reading_time = max(
            1, len(self.description.split()) // 200)  # avg 200 wpm
        super().save(*args, **kwargs)

    def increment_views(self, ip_address):
        if not self.view_records.filter(ip_address=ip_address).exists():
            PostView.objects.create(post=self, ip_address=ip_address)
            self.view_count += 1
            self.save(update_fields=['view_count'])

    @property
    def views(self):
        return self.view_count

    @property
    def likes_count(self):
        return self.likes.count()

    def is_publishable(self):
        """Checks whether the scheduled publish time has arrived"""

        return self.status == self.PostStatus.SCHEDULED and self.publish_time and self.publish_time <= timezone.now()
