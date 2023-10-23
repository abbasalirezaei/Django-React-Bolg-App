from django.contrib import admin
from .models import (
    Post,
    Category,
    Author,
    BlogLike,
    BlogComment,
CommentLike,
    )

# Register your models here.

# class PostLike(admin.TabularInline):
#     model = PostLike
class LikeAdmin(admin.ModelAdmin):

    list_display = ("id", "user", "blog_item")
    list_display_links = ("id", "user", "blog_item")


class PostAdmin(admin.ModelAdmin):
    # inlines = [PostLike]
    # where to search.
    search_fields = ['content', "user__username", "user__email"]
    # this to dispaly USER Content
    # "__str__" dysplay object(id) by defualt
    list_display = ["id", 'title', 'slug','views']

    class Meta:
        model = Post
class CategoryAdmin(admin.ModelAdmin):
    
    list_display = ["id", 'name']

    class Meta:
        model = Post


admin.site.register(Post, PostAdmin)
admin.site.register(Author)
admin.site.register(Category, CategoryAdmin)
admin.site.register(BlogLike, LikeAdmin)

class CommentBlogAdmin(admin.ModelAdmin):

    list_display = ("id", "user", "blog_item", "blog_body")
    list_display_links = ("id", "user", "blog_item")


class CommentLikeAdmin(admin.ModelAdmin):

    list_display = ("id", "user", "comment_blog_item")
    list_display_links = ("id", "user", "comment_blog_item")


admin.site.register(BlogComment, CommentBlogAdmin)
admin.site.register(CommentLike, CommentLikeAdmin)
