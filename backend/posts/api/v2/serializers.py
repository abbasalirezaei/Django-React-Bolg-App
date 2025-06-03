from rest_framework import serializers

from posts.models import (
    Post, Tag
)


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = [
            "name",
        ]


class PostSerializer(serializers.ModelSerializer):
    tags = serializers.PrimaryKeyRelatedField(queryset=Tag.objects.all(), many=True)

    class Meta:
        model = Post
        fields = [

            "title",
            "slug", "author",
            "categories", "tags",
            "description", "short_description",
            "reading_time", "img",
            "status", "is_featured",
            "created_at", "updated_at",
        ]
        read_only_fields = [
            "slug", "author",
            "reading_time", "updated_at",
            "created_at"
        ]
