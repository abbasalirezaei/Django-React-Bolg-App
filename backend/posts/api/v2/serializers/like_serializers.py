from rest_framework import serializers

from posts.models import (
    PostLike
)

"""
list of serializers for the posts app:
1. LikeSerializer: for serializing PostLike model data.
"""

# like serializer
class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostLike
        fields = ["post", "created_at"]
