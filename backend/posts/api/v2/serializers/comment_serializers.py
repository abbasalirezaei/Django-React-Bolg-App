from rest_framework import serializers

from posts.models import (
    Post, Tag, PostComment, Category, PostLike, PostBookmark, CommentLike
)

from accounts.api.v1.serializers import ProfileSerializer


"""
list of serializers:
1. PostCommentSerializer: for serializing PostComment model data.
2. CommentLikeSerializer: for serializing PostCommentLike model data.

"""


class PostCommentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only=True)
    post = serializers.PrimaryKeyRelatedField(read_only=True)
    parent = serializers.PrimaryKeyRelatedField(
        queryset=PostComment.objects.all(),
        allow_null=True,
        required=False
    )

    class Meta:
        model = PostComment
        fields = ['id', 'user', 'content', 'created_at', 'parent', 'post']
        read_only_fields = ['user', 'created_at', 'post']

    def get_user(self, obj):
        return ProfileSerializer(obj.user.profile, context=self.context).data

    def validate_content(self, value):
        spm_words = ["fucks", "fuck", 'shit', 'idiot']
        for word in spm_words:
            if word.lower() in value.lower():
                raise serializers.ValidationError(
                    "Your comment contains spam words.")
        return value


# comment like serializer
class CommentLikeSerializer(serializers.ModelSerializer):
    """Serializer for PostCommentLike model."""
    user = serializers.SerializerMethodField(read_only=True)
    comment_blog_item = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = CommentLike
        fields = ['id', 'user', 'comment_blog_item', 'created_at']
        read_only_fields = ['user', 'comment_blog_item', 'created_at']

    def get_user(self, obj):
        return ProfileSerializer(obj.user.profile, context=self.context).data
