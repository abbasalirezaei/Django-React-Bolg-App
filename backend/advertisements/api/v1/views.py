from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from advertisements.models import Advertisement
from .serializers import AdvertisementSerializer
from django.db.models import F

class AdvertisementListView(APIView):
    def get(self, request):
        # Get active ads, ordered by priority and creation date
        ads = Advertisement.objects.filter(active=True).order_by('-display_priority', '-created_at')
        serializer = AdvertisementSerializer(ads, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)