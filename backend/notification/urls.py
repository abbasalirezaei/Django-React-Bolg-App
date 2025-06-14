from django.urls import path, include


app_name = 'notifications'
urlpatterns = [
    path('api/v1/', include('notification.api.v1.urls', namespace='v1')),

]
