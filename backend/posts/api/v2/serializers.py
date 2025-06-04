from rest_framework import serializers

from posts.models import (
    Post, Tag, PostComment,Category
)

from accounts.api.v1.serializers import ProfileSerializer
class PostCommentSerializer(serializers.ModelSerializer):
    user = ProfileSerializer(source='user.profile', read_only=True)
    class Meta:
        model = PostComment
        fields = ['id', 'user', 'content', 'created_at', 'parent']
        read_only_fields = ['user', 'created_at',]

    def create(self, validated_data):
        post = self.context.get("post")
        user = self.context.get("request").user
        return PostComment.objects.create(
            post=post,
            user=user,
            **validated_data
        )


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = [
            "name",
        ]

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

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
