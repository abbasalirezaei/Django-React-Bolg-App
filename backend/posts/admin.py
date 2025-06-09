from django.contrib import admin
from django.utils.html import format_html

from .models import (
    Category, Tag, Post, PostView, PostLike, PostComment,
    CommentLike, PostBookmark
)

# --- Shared Mixin for image preview fields ---
class ImagePreviewMixin:
    def image_tag(self, obj):
        if hasattr(obj, 'img') and obj.img:
            return format_html('<img src="{}" style="width: 50px; height:auto;" />', obj.img.url)
        return "-"
    image_tag.short_description = "Image"

# --- Admins ---
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin, ImagePreviewMixin):
    list_display = ("name", "body", "image_tag")
    search_fields = ("name",)
    readonly_fields = ("image_tag",)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(PostBookmark)
class BookmarkAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'created_at')
    search_fields = ('user__email', 'post__title')
    list_filter = ('created_at',)
    ordering = ('-created_at',)


# --- Inline Models ---
class PostViewInline(admin.TabularInline):
    model = PostView
    readonly_fields = ("ip_address", "created_at")
    extra = 0
    can_delete = False
    verbose_name = "View Record"
    verbose_name_plural = "View Records"
    classes = ['collapse']


class PostLikeInline(admin.TabularInline):
    model = PostLike
    readonly_fields = ("user",)
    extra = 0
    can_delete = False
    classes = ['collapse']


class PostCommentInline(admin.TabularInline):
    model = PostComment
    fields = ("user", "content", "parent", "created_at")
    readonly_fields = ("created_at",)
    extra = 0
    classes = ['collapse']


# --- Post Admin ---
@admin.register(Post)
class PostAdmin(admin.ModelAdmin, ImagePreviewMixin):
    list_display = (
        "title", "author_email", "status", "is_featured",
        "created_at", "updated_at", "reading_time",
        "view_count", "image_tag",
    )
    search_fields = (
        "title", "description", "author__email",
        "categories__name", "tags__name"
    )
    ordering = ("-created_at",)
    filter_horizontal = ("categories", "tags")
    autocomplete_fields = ("author", "categories", "tags")
    list_filter = ("status", "is_featured", "categories", "tags", "created_at")
    list_editable = ("status", "is_featured")
    prepopulated_fields = {"slug": ("title",)}

    fieldsets = (
        (None, {"fields": ("title", "slug", "author", "status", "is_featured", "img")}),
        ("Content", {"fields": ("description", "short_description", "reading_time")}),
        ("Relations", {"fields": ("categories", "tags")}),
        ("Timestamps & Stats", {
            "fields": ("created_at", "updated_at", "view_count", "image_tag"),
            "classes": ("collapse",),
        }),
    )

    readonly_fields = ("created_at", "updated_at", "view_count", "image_tag")
    inlines = [PostViewInline, PostLikeInline, PostCommentInline]

    def author_email(self, obj):
        return obj.author.email if obj.author else "-"
    author_email.short_description = "Author Email"

    def get_readonly_fields(self, request, obj=None):
        ro_fields = list(super().get_readonly_fields(request, obj))
        if obj:
            ro_fields.append("reading_time")
        return ro_fields


@admin.register(PostComment)
class PostCommentAdmin(admin.ModelAdmin):
    list_display = ("short_content", "user_email", "post_title", "parent", "created_at")
    search_fields = ("content", "user__email", "post__title")
    list_filter = ("created_at",)
    readonly_fields = ("created_at", "updated_at")

    def short_content(self, obj):
        return obj.content[:50] + ("..." if len(obj.content) > 50 else "")
    short_content.short_description = "Content"

    def user_email(self, obj):
        return obj.user.email if obj.user else "Anonymous"
    user_email.short_description = "User Email"

    def post_title(self, obj):
        return obj.post.title
    post_title.short_description = "Post"


@admin.register(PostLike)
class PostLikeAdmin(admin.ModelAdmin):
    list_display = ("user_email", "post_title")
    search_fields = ("user__email", "post__title")

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = "User Email"

    def post_title(self, obj):
        return obj.post.title
    post_title.short_description = "Post"


@admin.register(CommentLike)
class CommentLikeAdmin(admin.ModelAdmin):
    list_display = ("user_email", "comment_preview")
    search_fields = ("user__email", "comment_blog_item__content")

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = "User Email"

    def comment_preview(self, obj):
        content = obj.comment_blog_item.content
        return content[:50] + ("..." if len(content) > 50 else "")
    comment_preview.short_description = "Comment Content Preview"


@admin.register(PostView)
class PostViewAdmin(admin.ModelAdmin):
    list_display = ("ip_address", "post_title", "created_at")
    search_fields = ("ip_address", "post__title")
    list_filter = ("created_at",)

    def post_title(self, obj):
        return obj.post.title
    post_title.short_description = "Post"


