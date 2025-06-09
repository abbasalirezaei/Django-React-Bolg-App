from rest_framework import serializers

from posts.models import (
    Post, Tag,  Category,  PostBookmark
)

from accounts.api.v1.serializers import ProfileSerializer
from ..serializers.comment_serializers import PostCommentSerializer

"""
list of serializers for the posts app:
1. PostSerializer: for serializing Post model data.
2. PostCommentSerializer: for serializing PostComment model data.
3. TagSerializer: for serializing Tag model data.
4. CategorySerializer: for serializing Category model data.
5. PostBookmarkSerializer: for serializing PostBookmark model data.
6. LikeSerializer: for serializing PostLike model data.
7. CommentLikeSerializer: for serializing PostCommentLike model data.


8. ProfileSerializer: for serializing Profile model data.
9. FollowSerializer: for serializing Follow model data.
"""

# tag serializer
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = [
            "name",
        ]

# category serializer
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

# post serializer
class PostSerializer(serializers.ModelSerializer):
    comments = PostCommentSerializer(many=True, read_only=True)
    author = ProfileSerializer(source='author.profile', read_only=True)
    likes = serializers.IntegerField(source="likes_count", read_only=True)
    views = serializers.IntegerField(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    categories = CategorySerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = [
            'id',
            "title",
            "slug", "author",
            "categories", "tags",
            "description", "short_description",
            "reading_time", "img",
            "status", "is_featured",
            "created_at", "updated_at",
            "comments", 'likes', 'views'
        ]
        read_only_fields = [
            "slug", "author",
            "reading_time", "updated_at",
            "created_at", 'status', 'likes'
        ]

    def get_likes(self, obj):
        return obj.likes.count()


# post bookmark serializer
class PostBookmarkSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only=True)
    post = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = PostBookmark
        fields = ['id', 'user', 'post', 'created_at']
        read_only_fields = ['user', 'post', 'created_at']

    def get_user(self, obj):
        return ProfileSerializer(obj.user.profile, context=self.context).data
    
