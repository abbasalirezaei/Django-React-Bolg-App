from django.urls import path, include


app_name = 'advertisements'
urlpatterns = [
    path('api/v1/', include('advertisements.api.v1.urls', namespace='v1')),

]
