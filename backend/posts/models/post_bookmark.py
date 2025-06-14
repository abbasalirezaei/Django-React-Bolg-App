from django.db import models
from django.contrib.auth import get_user_model
from posts.models.post import Post
User = get_user_model()



class PostBookmark(models.Model):
        
    """
    This module defines the PostBookmark model, which allows users to bookmark posts.
    A user can bookmark a post, and each bookmark is unique to the user and the post.
    The model includes a foreign key to the User model and a foreign key to the Post model.
    It also includes a created_at field to track when the bookmark was created.
    """
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='bookmarked_posts')
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name='bookmarks')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')

    def __str__(self):
        return f"{self.user.username} bookmarked {self.post.title}"
    
    def save(self, *args, **kwargs):
        if not self.pk:
            # Ensure that the user is not bookmarking their own post
            if self.user == self.post.author:
                raise ValueError("You cannot bookmark your own post.")
        super().save(*args, **kwargs)
