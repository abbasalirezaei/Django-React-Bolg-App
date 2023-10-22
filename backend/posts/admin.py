from django.contrib import admin
from .models import Post,Category,Author
# Register your models here.

# class PostLike(admin.TabularInline):
#     model = PostLike


class PostAdmin(admin.ModelAdmin):
    # inlines = [PostLike]
    # where to search.
    search_fields = ['content', "user__username", "user__email"]
    # this to dispaly USER Content
    # "__str__" dysplay object(id) by defualt
    list_display = ["id", 'title', 'slug']

    class Meta:
        model = Post
class CategoryAdmin(admin.ModelAdmin):
    
    list_display = ["id", 'name']

    class Meta:
        model = Post


admin.site.register(Post, PostAdmin)
admin.site.register(Author)
admin.site.register(Category, CategoryAdmin)