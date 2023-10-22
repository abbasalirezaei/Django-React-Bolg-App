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
    # likes = models.ManyToManyField(User,blank=True,related_name='likes')
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
    
