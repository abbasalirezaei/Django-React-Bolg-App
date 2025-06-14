from django.urls import path, include
from django.urls import path
from .views import AdvertisementListView


app_name = 'advertisements-api-v1'
urlpatterns = [
    path('advertisements/', AdvertisementListView.as_view(),
         name='advertisement-list'),
]
