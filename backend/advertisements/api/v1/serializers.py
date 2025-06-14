from rest_framework import serializers
from advertisements.models import Advertisement

class AdvertisementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advertisement
        fields = ['id', 'title', 'description', 'image', 'url', 'is_active', 'created_at', 'view_count']

    def update(self, instance, validated_data):
        # Increment view count when the ad is viewed
        instance.view_count += 1
        instance.save()
        return super().update(instance, validated_data)