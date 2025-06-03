from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils.text import slugify
from django.contrib.auth import get_user_model

User = get_user_model()


class Category(models.Model):
    name = models.CharField(_("Category name"), max_length=100)
    body = models.TextField(_("Category body"), blank=True, null=True)
    img = models.ImageField(upload_to="category_image/", blank=True, null=True)

    class Meta:
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(_("Tag name"), max_length=30, unique=True)

    class Meta:
        db_table = 'Tags'
        managed = True
        verbose_name = _('Tag')
        verbose_name_plural = _('Tags')

    def __str__(self):
        return self.name

class Post(models.Model):
    title = models.CharField(_("Post title"), max_length=250)
    slug = models.SlugField(_("Slug"), unique=True, blank=True)
    author = models.ForeignKey(
        User,
        related_name="posts",
        null=True,
        on_delete=models.SET_NULL,
        verbose_name=_("Author")
    )
    categories = models.ManyToManyField(Category, related_name="posts", blank=True, verbose_name=_("Categories"))
    tags = models.ManyToManyField(Tag, related_name="posts", blank=True, verbose_name=_("Tags"))
    description = models.TextField(_("Post description"))
    short_description = models.CharField(_("Short description"), max_length=300, blank=True)
    reading_time = models.PositiveIntegerField(_("Reading time (minutes)"), default=0)
    img = models.ImageField(_("Post image"), upload_to="blog_image/", blank=True, null=True)
    status = models.BooleanField(_("Published status"), default=False)
    is_featured = models.BooleanField(_("Featured"), default=False)

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

        self.reading_time = max(1, len(self.description.split()) // 200)  # avg 200 wpm
        super().save(*args, **kwargs)

    def increment_views(self, ip_address):
        if not self.view_records.filter(ip_address=ip_address).exists():
            PostView.objects.create(post=self, ip_address=ip_address)

    @property
    def views(self):
        return self.view_records.count()


class PostView(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="view_records", verbose_name=_("Post"))
    ip_address = models.GenericIPAddressField(_("IP Address"))
    created_at = models.DateTimeField(_("Viewed at"), auto_now_add=True)

    class Meta:
        unique_together = ('post', 'ip_address')
        verbose_name = _("Post view")
        verbose_name_plural = _("Post views")

    def __str__(self):
        return f"{self.ip_address} viewed {self.post.title}"


class PostLike(models.Model):
    user = models.ForeignKey(
        User,
        verbose_name=_("User"),
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


class PostComment(models.Model):
    user = models.ForeignKey(
        User,
        verbose_name=_("User"),
        on_delete=models.CASCADE,
        null=True
    )
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="comments",
        verbose_name=_("Post")
    )
    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="replies",
        verbose_name=_("Parent comment")
    )
    content = models.TextField(_("Comment content"))
    created_at = models.DateTimeField(_("Created at"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Updated at"), auto_now=True)

    class Meta:
        verbose_name = _("Post comment")
        verbose_name_plural = _("Post comments")

    def __str__(self):
        return f"Comment by {self.user.email if self.user else 'Anonymous'} on {self.post.title}"

    def children(self):
        return self.replies.all()


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
