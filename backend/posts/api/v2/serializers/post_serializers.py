from rest_framework import serializers

from posts.models import (
    Post, Tag,  Category,  PostBookmark
)

from django.utils import timezone
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
    description_display = serializers.SerializerMethodField(read_only=True)
    description = serializers.CharField(write_only=True)
    status = serializers.ChoiceField(choices=Post.PostStatus.choices)

    class Meta:
        model = Post
        fields = [
            'id',
            "title",
            "slug", "author",
            "categories", "tags",
            "description",
            "description_display",
            "short_description",
            "reading_time", "img",
            "status", "is_featured",
            "created_at", "updated_at",
            "comments", 'likes', 'views', "publish_time",
        ]
        read_only_fields = [
            "slug", "author", "short_description",
            "reading_time", "updated_at",
            "created_at", 'status', 'likes'
        ]

    def get_likes(self, obj):
        return obj.likes.count()

    def get_description_display(self, obj):
        request = self.context.get('request')
        user = request.user if request else None

        def _summarize(text, max_chars=300):
            return text.split("\n")[0][:max_chars] + "..." if text else ""

        """
        First: post is featured or not
        If post is featured:
            Second: if user is authenticated or not
            Third:  if user is the author of the post or not
            Fourth: if user is premium or not
            Fifth:  if user is not premium, show the summary of the post
        """

        # if post is not featured, show full description
        if not obj.is_featured:
            return obj.description

        # if user is not authenticated, show summary of the post
        if not user or not user.is_authenticated:
            return _summarize(obj.description)

        # if user is the author of the post, always return full description
        if obj.author == user:
            return obj.description

        # check the user's profile for premium status(no matter if reader or author)
        profile = getattr(user, "profile", None)
        is_premium = (
            profile and profile.is_premium and
            (profile.premium_expiry is None or profile.premium_expiry > timezone.now())
        )

        # if user is premium, return full description
        if is_premium:
            return obj.description

        # otherwise show the summary the post
        return _summarize(obj.description)

    def validate(self, data):
        status = data.get('status')
        publish_time = data.get('publish_time')

        # If we're updating and there's existing data
        if self.instance:
            status = status or self.instance.status
            publish_time = publish_time or self.instance.publish_time

        # If the post is scheduled but doesn't have a publish time
        if status == Post.PostStatus.SCHEDULED and not publish_time:
            raise serializers.ValidationError({
                'publish_time': "You must set a publish time when the post is scheduled."
            })

        # If the post is not scheduled, it shouldn't have a publish_time
        if status != Post.PostStatus.SCHEDULED:
            data['publish_time'] = None

        return data
    def to_representation(self, instance):
        rep = super().to_representation(instance)

  
        rep['description'] = rep.pop('description_display', '')

        return rep

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
