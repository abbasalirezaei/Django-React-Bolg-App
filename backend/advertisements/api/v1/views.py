from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from advertisements.models import Advertisement
from .serializers import AdvertisementSerializer
from django.db.models import F

class AdvertisementListView(APIView):
    def get(self, request):
        ads = Advertisement.objects.filter(active=True)
        if request.user.is_authenticated and hasattr(request.user, 'profile') and request.user.profile.is_premium:
            ads=ads.filter(show_to_premium=True)

        ads = ads.order_by('-display_priority', '-created_at')
        serializer = AdvertisementSerializer(ads, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)