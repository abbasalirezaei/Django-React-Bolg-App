from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
User = get_user_model()

# Create your models here.




class Author(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    
    def __str__(self):
        return self.user.username


class Category(models.Model):
    name = models.CharField(_("Category name"), max_length=100)
    body = models.TextField(_("cat body"),blank=True,null=True)
    img=models.ImageField(upload_to="category_image/",blank=True,null=True)
    class Meta:
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")

    def __str__(self):
        return self.name


class Post(models.Model):
    title = models.CharField(_("Post title"), max_length=250)
    slug = models.SlugField()
    author = models.ForeignKey(
        Author,
        related_name="posts",
        null=True,
        on_delete=models.SET_NULL,
    )
    
    body = models.TextField(_("Post body"))
    categories = models.ManyToManyField(Category, related_name="posts_category", blank=True)
    tags=models.TextField(blank=True,null=True,help_text="sperte wvery tags wih , and tab ")
   
    status = models.BooleanField(default=False)
    img=models.ImageField(upload_to="blog_image/",blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    views = models.IntegerField(default=0)
    viewed_ips = models.TextField(blank=True)


    def increment_views(self, ip_address):
        # بررسی آی‌پی در لیست آی‌پی‌های مشاهده کننده
        if ip_address not in self.viewed_ips.split(','):
            self.views += 1
            self.viewed_ips += f'{ip_address},'
            self.save()

    def increase_views(self):
        self.views +=1
        self.save()
        
    class Meta:
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.title} by {self.author.user.username}"
    
    def get_tag_list(self):
        tagList=[]
        if self.tags is not None:
            tagList=self.tags.strip().split(', ')
            
        else:
            tagList = []
        
        return tagList
    

class BlogLike(models.Model):
    user = models.ForeignKey(User, verbose_name=("user"), on_delete=models.CASCADE)
    blog_item = models.ForeignKey(Post, on_delete=models.CASCADE)
    like_status=models.BooleanField(default=False)

    def __str__(self):
        return f"BlogLike({self.user}, {self.blog_item})"



class BlogComment(models.Model):
    user = models.ForeignKey(User, verbose_name=("user"), on_delete=models.CASCADE, null=True)
    blog_item = models.ForeignKey(Post, on_delete=models.CASCADE)
    blog_body = models.TextField()

    parent = models.ForeignKey("self", on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return f"BlogComment({self.user}, {self.blog_item}, {self.blog_body})"

    def children(self):
        return BlogComment.objects.filter(parent=self)


class CommentLike(models.Model):
    user = models.ForeignKey(User, verbose_name=("user"), on_delete=models.CASCADE)
    comment_blog_item = models.ForeignKey(BlogComment, on_delete=models.CASCADE)

    def __str__(self):
        return f"CommentLike({self.user}, {self.comment_blog_item})"
